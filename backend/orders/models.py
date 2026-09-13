import uuid
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from products.models import Product

class Order(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending Payment'),
        ('CONFIRMED', 'Order Confirmed'),
        ('SHIPPED', 'Shipped'),
        ('DELIVERED', 'Delivered'),
        ('CANCELLED', 'Cancelled'),
    ]

    order_id = models.CharField(max_length=64, primary_key=True, editable=False)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='orders')
    session_id = models.CharField(max_length=128, db_index=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    delivery_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    final_amount = models.DecimalField(max_digits=10, decimal_places=2, db_index=True)
    delivery_days = models.IntegerField(default=3)
    payment_method = models.CharField(max_length=32, default='UPI') # UPI, Card, NetBanking, COD
    status = models.CharField(max_length=32, choices=STATUS_CHOICES, default='CONFIRMED', db_index=True)
    shipping_name = models.CharField(max_length=128, default='Shopper')
    shipping_city = models.CharField(max_length=64, default='Bengaluru')
    shipping_pincode = models.CharField(max_length=10, default='560001')
    shipping_address = models.TextField(default='123 Fashion Street, Indiranagar')
    created_at = models.DateTimeField(default=timezone.now, db_index=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.order_id:
            self.order_id = f"TL-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Order {self.order_id} - ₹{self.final_amount} ({self.status})"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, related_name='order_items')
    product_name = models.CharField(max_length=255)
    brand = models.CharField(max_length=128)
    size = models.CharField(max_length=16, default='M')
    quantity = models.IntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    image_url = models.URLField(max_length=1000, blank=True)

    def __str__(self):
        return f"{self.quantity}x {self.product_name} ({self.size})"

class Wishlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='wishlist_items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='wishlisted_by')
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ('user', 'product')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} -> {self.product.name}"
