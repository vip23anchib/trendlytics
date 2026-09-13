from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('core.urls')),
    path('api/', include('products.urls')),
    path('api/', include('events.urls')),
    path('api/', include('orders.urls')),
    path('api/', include('analytics_api.urls')),
]
