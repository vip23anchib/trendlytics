from django.test import TestCase
from decimal import Decimal
from products.models import Category, Product
from events.models import Event
from orders.models import Order
from core.models import UserSession

class AnalyticsApiTests(TestCase):
    def setUp(self):
        cat = Category.objects.create(name='Beauty', slug='beauty')
        p = Product.objects.create(
            name='Luxury Eau De Parfum',
            brand='Velora Luxe',
            category=cat,
            description='Test perfume',
            price=Decimal('3899.00'),
            original_price=Decimal('6500.00'),
            image_url='https://example.com/perfume.jpg'
        )
        UserSession.objects.create(session_id='sess_analytics_1', device_type='desktop', experiment_variant='control_keyword')
        UserSession.objects.create(session_id='sess_analytics_2', device_type='mobile', experiment_variant='treatment_ai_search')
        
        Event.objects.create(session_id='sess_analytics_1', event_type='session_start')
        Event.objects.create(session_id='sess_analytics_1', event_type='product_view', product=p)
        Event.objects.create(session_id='sess_analytics_1', event_type='purchase_completed', product=p)

    def test_overview_kpis_endpoint(self):
        res = self.client.get('/api/analytics/overview/')
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn('kpis', data)

    def test_funnel_endpoint(self):
        res = self.client.get('/api/analytics/funnel/')
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn('funnel_steps', data)

    def test_experiment_metrics_endpoint(self):
        res = self.client.get('/api/analytics/experiment/')
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn('metrics', data)
