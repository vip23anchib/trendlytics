from rest_framework import serializers
from .models import Order, OrderItem, Wishlist
from products.serializers import ProductListSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'brand', 'size', 'quantity', 'unit_price', 'image_url']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'order_id', 'user', 'session_id', 'total_amount',
            'discount_amount', 'delivery_fee', 'final_amount',
            'delivery_days', 'payment_method', 'status',
            'shipping_name', 'shipping_city', 'shipping_pincode', 'shipping_address',
            'created_at', 'items'
        ]

class WishlistSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Wishlist
        fields = ['id', 'user', 'product', 'product_id', 'created_at']
