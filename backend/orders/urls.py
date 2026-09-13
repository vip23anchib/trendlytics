from django.urls import path
from .views import CheckoutView, OrderListView, WishlistToggleView, WishlistListView

urlpatterns = [
    path('orders/checkout/', CheckoutView.as_view(), name='checkout'),
    path('orders/', OrderListView.as_view(), name='order_list'),
    path('wishlist/toggle/', WishlistToggleView.as_view(), name='wishlist_toggle'),
    path('wishlist/', WishlistListView.as_view(), name='wishlist_list'),
]
