from django.urls import path
from .views import (
    CategoryListView,
    ProductListView,
    ProductDetailView,
    SimilarProductsView,
    RecommendedProductsView,
    AISmartSearchView,
)

urlpatterns = [
    path('categories/', CategoryListView.as_view(), name='category_list'),
    path('products/', ProductListView.as_view(), name='product_list'),
    path('products/<int:pk>/', ProductDetailView.as_view(), name='product_detail'),
    path('products/<int:pk>/similar/', SimilarProductsView.as_view(), name='product_similar'),
    path('products/recommended/', RecommendedProductsView.as_view(), name='product_recommended'),
    path('search/ai/', AISmartSearchView.as_view(), name='ai_smart_search'),
]
