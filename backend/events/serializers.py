from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Event
from products.models import Product

class EventSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_brand = serializers.CharField(source='product.brand', read_only=True)
    product_price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Event
        fields = [
            'event_id', 'user', 'session_id', 'event_type',
            'product', 'product_name', 'product_brand', 'product_price',
            'search_query', 'device_type', 'timestamp', 'metadata'
        ]

class EventIngestSerializer(serializers.Serializer):
    session_id = serializers.CharField(max_length=128)
    event_type = serializers.CharField(max_length=64)
    user_id = serializers.IntegerField(required=False, allow_null=True)
    product_id = serializers.IntegerField(required=False, allow_null=True)
    search_query = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    device_type = serializers.CharField(required=False, default='desktop')
    metadata = serializers.DictField(required=False, default=dict)
