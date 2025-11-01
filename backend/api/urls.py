# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, AddressViewSet, CategoryViewSet, ProductViewSet, 
    ProductVariantViewSet, BlogPostViewSet, 
    PromoCodeViewSet, PromoCodeUserViewSet, OrderViewSet, OrderItemViewSet,
    LogoutView,MeView,RequestOTPView,VerifyOTPView, ProductImageViewSet, BlogImageViewSet
)

from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'addresses', AddressViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'products', ProductViewSet)
router.register(r'variants', ProductVariantViewSet,basename='varinats')
router.register(r'blog-posts', BlogPostViewSet)
router.register(r'blog-images', BlogImageViewSet, basename='blog-images')
router.register(r'promos', PromoCodeViewSet)
router.register(r'product-images', ProductImageViewSet, basename='product-images')
router.register(r'promo-users', PromoCodeUserViewSet, basename='promo-user')
router.register(r'orders', OrderViewSet, basename='orders')
router.register(r'order-items', OrderItemViewSet, basename='order-items')

urlpatterns = [
    path("logout/", LogoutView.as_view(), name="logout"),
    path("me/", MeView.as_view(), name="me"), 
    path("token/refresh/", TokenRefreshView.as_view(), name='token_refresh'),
    path("request-otp/", RequestOTPView.as_view(), name="request-otp"),
    path("verify-otp/", VerifyOTPView.as_view(), name="verify-otp"),
    path("", include(router.urls)),   # ✅ include router urls here
]

