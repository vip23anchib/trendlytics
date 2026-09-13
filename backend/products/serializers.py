from rest_framework import serializers
from .models import Category, SubCategory, Product

class SubCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SubCategory
        fields = ['id', 'name', 'slug']

class CategorySerializer(serializers.ModelSerializer):
    subcategories = SubCategorySerializer(many=True, read_only=True)
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'image_url', 'icon_name', 'subcategories', 'product_count']

    def get_product_count(self, obj):
        return obj.products.count()

class ProductListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'brand', 'category', 'category_name', 'category_slug',
            'price', 'original_price', 'discount_percentage',
            'rating', 'rating_count', 'color', 'available_sizes',
            'delivery_days', 'occasion', 'season', 'material',
            'popularity_score', 'image_url', 'is_trending', 'is_featured'
        ]

class ProductDetailSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    subcategory_name = serializers.CharField(source='subcategory.name', read_only=True, default='')

    class Meta:
        model = Product
        fields = '__all__'
