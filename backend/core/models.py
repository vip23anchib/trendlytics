import uuid
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class UserProfile(models.Model):
    SEGMENT_CHOICES = [
        ('new', 'New Visitor'),
        ('budget', 'Budget Conscious (< ₹1500)'),
        ('trendsetter', 'Trendsetter & High Intent'),
        ('luxury', 'Premium / Luxury (> ₹4000)'),
        ('occasional', 'Occasional Shopper'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    is_returning = models.BooleanField(default=False)
    segment = models.CharField(max_length=32, choices=SEGMENT_CHOICES, default='new')
    preferred_device = models.CharField(max_length=16, default='mobile')
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.user.username} ({self.segment})"

class UserSession(models.Model):
    session_id = models.CharField(max_length=128, primary_key=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='sessions')
    device_type = models.CharField(max_length=32, default='mobile', db_index=True)
    experiment_variant = models.CharField(max_length=64, default='control_keyword', db_index=True) # control_keyword vs treatment_ai_search
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True, default='')
    referrer = models.CharField(max_length=255, blank=True, default='')
    created_at = models.DateTimeField(default=timezone.now, db_index=True)
    last_active = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Session {self.session_id[:8]} - {self.device_type} ({self.experiment_variant})"

class Experiment(models.Model):
    name = models.CharField(max_length=100, unique=True)
    key = models.CharField(max_length=50, unique=True)
    description = models.TextField()
    is_active = models.BooleanField(default=True)
    control_name = models.CharField(max_length=50, default='control_keyword')
    treatment_name = models.CharField(max_length=50, default='treatment_ai_search')
    traffic_split_percent = models.IntegerField(default=50) # 50% Control, 50% Treatment
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Experiment: {self.name} [{'ACTIVE' if self.is_active else 'PAUSED'}]"
