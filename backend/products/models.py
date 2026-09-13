from django.db import models
from django.utils import timezone

class Category(models.Model):
    name = models.CharField(max_length=64, unique=True)
    slug = models.SlugField(max_length=64, unique=True)
    description = models.TextField(blank=True, default='')
    image_url = models.URLField(max_length=500, blank=True, default='')
    icon_name = models.CharField(max_length=32, blank=True, default='Shirt')
    display_order = models.IntegerField(default=0)

    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['display_order', 'name']

    def __str__(self):
        return self.name

class SubCategory(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='subcategories')
    name = models.CharField(max_length=64)
    slug = models.SlugField(max_length=64)

    class Meta:
        verbose_name_plural = 'SubCategories'
        unique_together = ('category', 'slug')

    def __str__(self):
        return f"{self.category.name} > {self.name}"

class Product(models.Model):
    OCCASIONS = [
        ('Casual', 'Casual Wear'),
        ('Party', 'Party & Evening'),
        ('Formal', 'Work & Formal'),
        ('Wedding', 'Wedding & Festive'),
        ('Sports', 'Athletic & Sports'),
        ('Loungewear', 'Loungewear & Night'),
    ]

    SEASONS = [
        ('Summer', 'Summer / Spring'),
        ('Winter', 'Winter / Fall'),
        ('All Season', 'All Season Essentials'),
        ('Monsoon', 'Monsoon Ready'),
    ]

    name = models.CharField(max_length=255, db_index=True)
    brand = models.CharField(max_length=128, db_index=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    subcategory = models.ForeignKey(SubCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2, db_index=True)
    original_price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_percentage = models.IntegerField(default=0, db_index=True)
    rating = models.FloatField(default=4.0, db_index=True)
    rating_count = models.IntegerField(default=100)
    color = models.CharField(max_length=50, db_index=True)
    available_sizes = models.JSONField(default=list) # e.g. ['S', 'M', 'L', 'XL'] or ['6', '7', '8', '9']
    stock = models.IntegerField(default=50)
    delivery_days = models.IntegerField(default=3, db_index=True)
    occasion = models.CharField(max_length=50, choices=OCCASIONS, default='Casual', db_index=True)
    season = models.CharField(max_length=50, choices=SEASONS, default='All Season', db_index=True)
    material = models.CharField(max_length=100, default='Cotton', db_index=True)
    popularity_score = models.FloatField(default=75.0, db_index=True)
    image_url = models.URLField(max_length=1000)
    additional_images = models.JSONField(default=list, blank=True)
    is_trending = models.BooleanField(default=False, db_index=True)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['-popularity_score', '-rating']
        indexes = [
            models.Index(fields=['category', 'price']),
            models.Index(fields=['brand', 'rating']),
            models.Index(fields=['occasion', 'season']),
        ]

    def __str__(self):
        return f"{self.brand} - {self.name} (₹{self.price})"
