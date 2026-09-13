from django.test import TestCase
from decimal import Decimal
from products.models import Category, Product
from orders.models import Order, OrderItem
from events.models import Event

class OrdersAndCheckoutTests(TestCase):
    def setUp(self):
        cat = Category.objects.create(name='Footwear', slug='footwear')
        self.product = Product.objects.create(
            name='Minimalist Leather Sneakers',
            brand='SoleCraft Co.',
            category=cat,
            description='Test shoe',
            price=Decimal('3499.00'),
            original_price=Decimal('5999.00'),
            delivery_days=2,
            image_url='https://example.com/shoe.jpg'
        )

    def test_simulated_checkout_flow(self):
        res = self.client.post('/api/orders/checkout/', {
            'session_id': 'sess_checkout_test',
            'shipping_name': 'Candidate Tester',
            'shipping_city': 'Bengaluru',
            'shipping_pincode': '560001',
            'shipping_address': 'Indiranagar 100ft road',
            'payment_method': 'UPI',
            'coupon_code': 'TREND20',
            'items': [
                {'product_id': self.product.id, 'quantity': 1, 'size': '9'}
            ]
        }, content_type='application/json')
        self.assertEqual(res.status_code, 201)
        data = res.json()
        self.assertTrue(data['order_id'].startswith('TL-'))
        # 3499 - 20% (699.80) = 2799.20
        self.assertAlmostEqual(float(data['final_amount']), 2799.20, places=1)
        
        # Verify purchase_completed event was logged
        self.assertTrue(Event.objects.filter(event_type='purchase_completed', session_id='sess_checkout_test').exists())
