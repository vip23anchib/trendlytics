from decimal import Decimal
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from .models import Order, OrderItem, Wishlist
from .serializers import OrderSerializer, WishlistSerializer
from products.models import Product
from events.models import Event

class CheckoutView(APIView):
    """
    Simulated purchase checkout flow.
    Processes cart items, computes pricing, writes Order & OrderItems,
    and logs purchase_completed telemetry event.
    """
    def post(self, request):
        items_data = request.data.get('items', [])
        if not items_data:
            return Response({'error': 'Cart cannot be empty for checkout'}, status=status.HTTP_400_BAD_REQUEST)

        session_id = request.data.get('session_id', 'demo-session')
        user_id = request.data.get('user_id')
        user = User.objects.filter(id=user_id).first() if user_id else None

        coupon_code = request.data.get('coupon_code', '').upper()
        payment_method = request.data.get('payment_method', 'UPI')
        shipping_name = request.data.get('shipping_name', 'Fashion Lover')
        shipping_city = request.data.get('shipping_city', 'Bengaluru')
        shipping_pincode = request.data.get('shipping_pincode', '560001')
        shipping_address = request.data.get('shipping_address', 'Flat 402, Royal Palms, Indiranagar')
        device_type = request.data.get('device_type', 'desktop')

        total_amount = Decimal('0.00')
        max_delivery_days = 3
        prepared_items = []

        for item in items_data:
            p_id = item.get('product_id')
            qty = int(item.get('quantity', 1))
            size = item.get('size', 'M')

            product = Product.objects.filter(id=p_id).first()
            if not product:
                continue

            price = product.price
            item_total = price * qty
            total_amount += item_total
            if product.delivery_days > max_delivery_days:
                max_delivery_days = product.delivery_days

            prepared_items.append({
                'product': product,
                'name': product.name,
                'brand': product.brand,
                'size': size,
                'quantity': qty,
                'unit_price': price,
                'image_url': product.image_url
            })

        if not prepared_items:
            return Response({'error': 'No valid products in cart'}, status=status.HTTP_400_BAD_REQUEST)

        # Coupon Discount Logic
        discount_amount = Decimal('0.00')
        if coupon_code == 'TREND20':
            discount_amount = total_amount * Decimal('0.20')
        elif coupon_code == 'FIRST500':
            discount_amount = min(Decimal('500.00'), total_amount * Decimal('0.30'))
        elif coupon_code == 'MYNTRASTYLE':
            discount_amount = total_amount * Decimal('0.15')

        # Free delivery if total > 999
        delivery_fee = Decimal('0.00') if total_amount >= 999 else Decimal('99.00')
        final_amount = total_amount - discount_amount + delivery_fee

        order = Order.objects.create(
            user=user,
            session_id=session_id,
            total_amount=total_amount,
            discount_amount=discount_amount,
            delivery_fee=delivery_fee,
            final_amount=final_amount,
            delivery_days=max_delivery_days,
            payment_method=payment_method,
            status='CONFIRMED',
            shipping_name=shipping_name,
            shipping_city=shipping_city,
            shipping_pincode=shipping_pincode,
            shipping_address=shipping_address,
        )

        for p_item in prepared_items:
            OrderItem.objects.create(
                order=order,
                product=p_item['product'],
                product_name=p_item['name'],
                brand=p_item['brand'],
                size=p_item['size'],
                quantity=p_item['quantity'],
                unit_price=p_item['unit_price'],
                image_url=p_item['image_url']
            )

        # Automatically record purchase_completed event
        Event.objects.create(
            user=user,
            session_id=session_id,
            event_type='purchase_completed',
            product=prepared_items[0]['product'] if prepared_items else None,
            device_type=device_type,
            metadata={
                'order_id': order.order_id,
                'final_amount': float(final_amount),
                'item_count': len(prepared_items),
                'coupon': coupon_code,
                'payment_method': payment_method
            }
        )

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)

class OrderListView(APIView):
    def get(self, request):
        user_id = request.query_params.get('user_id')
        session_id = request.query_params.get('session_id')

        queryset = Order.objects.prefetch_related('items').all()
        if user_id:
            queryset = queryset.filter(user_id=user_id)
        elif session_id:
            queryset = queryset.filter(session_id=session_id)

        serializer = OrderSerializer(queryset[:20], many=True)
        return Response(serializer.data)

class WishlistToggleView(APIView):
    def post(self, request):
        user_id = request.data.get('user_id')
        product_id = request.data.get('product_id')
        session_id = request.data.get('session_id', 'demo-session')

        if not user_id or not product_id:
            return Response({'error': 'user_id and product_id are required'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.filter(id=user_id).first()
        product = Product.objects.filter(id=product_id).first()

        if not user or not product:
            return Response({'error': 'User or product not found'}, status=status.HTTP_404_NOT_FOUND)

        item = Wishlist.objects.filter(user=user, product=product).first()
        if item:
            item.delete()
            # Log wishlist_remove
            Event.objects.create(
                user=user,
                session_id=session_id,
                event_type='wishlist_remove',
                product=product,
                metadata={'action': 'removed'}
            )
            return Response({'status': 'removed', 'is_wishlisted': False})
        else:
            Wishlist.objects.create(user=user, product=product)
            # Log wishlist_add
            Event.objects.create(
                user=user,
                session_id=session_id,
                event_type='wishlist_add',
                product=product,
                metadata={'action': 'added'}
            )
            return Response({'status': 'added', 'is_wishlisted': True})

class WishlistListView(APIView):
    def get(self, request):
        user_id = request.query_params.get('user_id')
        if not user_id:
            return Response([])
        items = Wishlist.objects.filter(user_id=user_id).select_related('product', 'product__category')
        serializer = WishlistSerializer(items, many=True)
        return Response(serializer.data)
