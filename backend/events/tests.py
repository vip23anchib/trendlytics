from django.test import TestCase
from .models import Event
from products.models import Category, Product
from decimal import Decimal

class EventTrackingTests(TestCase):
    def setUp(self):
        cat = Category.objects.create(name='Men', slug='men')
        self.product = Product.objects.create(
            name='Oxford Cotton Shirt',
            brand='Urban Thread',
            category=cat,
            description='Test shirt',
            price=Decimal('1899.00'),
            original_price=Decimal('2999.00'),
            image_url='https://example.com/shirt.jpg'
        )

    def test_single_event_tracking(self):
        res = self.client.post('/api/events/track/', {
            'session_id': 'sess_test_100',
            'event_type': 'product_view',
            'product_id': self.product.id,
            'device_type': 'desktop',
            'metadata': {'source': 'test_case'}
        }, content_type='application/json')
        self.assertEqual(res.status_code, 201)
        self.assertEqual(Event.objects.count(), 1)

    def test_batch_event_tracking(self):
        res = self.client.post('/api/events/track/', [
            {'session_id': 'sess_test_101', 'event_type': 'session_start'},
            {'session_id': 'sess_test_101', 'event_type': 'homepage_view'},
            {'session_id': 'sess_test_101', 'event_type': 'search', 'search_query': 'kurta'},
        ], content_type='application/json')
        self.assertEqual(res.status_code, 201)
        self.assertEqual(Event.objects.filter(session_id='sess_test_101').count(), 3)
