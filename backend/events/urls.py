from django.urls import path
from .views import TrackEventView, LiveEventFeedView

urlpatterns = [
    path('events/track/', TrackEventView.as_view(), name='track_event'),
    path('events/live/', LiveEventFeedView.as_view(), name='live_events'),
]
