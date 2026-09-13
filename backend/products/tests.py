from decimal import Decimal
from django.test import TestCase
from .models import Category, SubCategory, Product

class ProductsApiTests(TestCase):
    def setUp(self):
        self.category = Category.objects.create(name='Women', slug='women')
        self.sub = SubCategory.objects.create(category=self.category, name='Dresses', slug='dresses')
        self.product = Product.objects.create(
            name='Black Floral Maxi Dress',
            brand='Aura & Silk',
            category=self.category,
            subcategory=self.sub,
            description='Elegant summer evening dress made from pure chiffon silk.',
            price=Decimal('2799.00'),
            original_price=Decimal('4999.00'),
            discount_percentage=44,
            rating=4.6,
            rating_count=320,
            color='Black',
            available_sizes=['S', 'M', 'L'],
            delivery_days=2,
            occasion='Party',
            season='Summer',
            material='Chiffon Silk',
            popularity_score=95.0,
            image_url='https://example.com/dress.jpg',
            is_trending=True
        )

    def test_product_list_and_filters(self):
        res = self.client.get('/api/products/?category=women&max_price=3000')
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data['total_count'], 1)
        self.assertEqual(data['results'][0]['name'], 'Black Floral Maxi Dress')

    def test_product_detail_and_similar(self):
        res = self.client.get(f'/api/products/{self.product.id}/')
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data['brand'], 'Aura & Silk')

        sim_res = self.client.get(f'/api/products/{self.product.id}/similar/')
        self.assertEqual(sim_res.status_code, 200)

    def test_ai_smart_search_intent_parser(self):
        # Test complex natural language intent parsing
        res = self.client.post('/api/search/ai/', {
            'query': 'black floral maxi dress for summer wedding under 3000'
        }, content_type='application/json')
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data['intent']['color'], 'Black')
        self.assertEqual(data['intent']['category'], 'Dress')
        self.assertEqual(data['intent']['max_price'], 3000)
        self.assertGreaterEqual(len(data['results']), 1)
