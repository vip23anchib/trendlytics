import uuid
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from products.models import Product

class Event(models.Model):
    EVENT_TYPES = [
        ('session_start', 'Session Start'),
        ('homepage_view', 'Homepage View'),
        ('category_view', 'Category View'),
        ('search', 'Search Query Entered'),
        ('search_result_view', 'Search Results Viewed'),
        ('filter_used', 'Filter Applied'),
        ('sort_used', 'Sort Applied'),
        ('product_view', 'Product Detail View'),
        ('wishlist_add', 'Added to Wishlist'),
        ('wishlist_remove', 'Removed from Wishlist'),
        ('add_to_cart', 'Added to Cart'),
        ('remove_from_cart', 'Removed from Cart'),
        ('checkout_started', 'Checkout Started'),
        ('checkout_abandoned', 'Checkout Abandoned'),
        ('purchase_completed', 'Purchase Completed'),
    ]

    event_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='events')
    session_id = models.CharField(max_length=128, db_index=True)
    event_type = models.CharField(max_length=64, choices=EVENT_TYPES, db_index=True)
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True, related_name='events')
    search_query = models.CharField(max_length=255, null=True, blank=True, db_index=True)
    device_type = models.CharField(max_length=32, default='desktop', db_index=True) # mobile, desktop, tablet
    timestamp = models.DateTimeField(default=timezone.now, db_index=True)
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['event_type', 'timestamp']),
            models.Index(fields=['session_id', 'timestamp']),
            models.Index(fields=['user', 'timestamp']),
            models.Index(fields=['product', 'event_type']),
            models.Index(fields=['device_type', 'event_type']),
        ]

    def __str__(self):
        return f"{self.timestamp.strftime('%Y-%m-%d %H:%M')} | {self.event_type} | {self.session_id[:8]}"
