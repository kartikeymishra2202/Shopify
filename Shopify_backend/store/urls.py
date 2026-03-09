from django.urls import path
from .views import ProductListView,ProductDetailView,UserRegistrationView,UserLoginView,UserProfileView,UserChangePasswordView,PasswordResetRequestView,PasswordResetConfirmView,CartSyncView,CheckoutView,MyOrdersView,CategoryListView,ActiveChatsView,Auth0BackendCallbackView,AdminProductCreateView
from rest_framework_simplejwt.views import TokenRefreshView
urlpatterns = [
    path('products/', ProductListView.as_view(), name='product-list'),
    path('products/<slug:slug>/', ProductDetailView.as_view(), name='product-detail'),
    path('admin/products/', AdminProductCreateView.as_view(), name='admin-product-create'),
    path('user/register',UserRegistrationView.as_view(),name='register'),
    path('user/login',UserLoginView.as_view(),name='login'),
    path('auth/callback', Auth0BackendCallbackView.as_view(), name='auth0-callback'),
    path('user/profile',UserProfileView.as_view(),name='profile'),
    path('user/changepassword',UserChangePasswordView.as_view(),name='changepassword'),
    path('user/password-reset-request', PasswordResetRequestView.as_view(), name='password-reset-request'),
    path('user/password-reset-confirm', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    path('user/cart/sync',CartSyncView.as_view(),name='cart-sync'),
    path('user/cart/', CartSyncView.as_view(), name='cart-get'),
    path('user/orders/checkout/',CheckoutView.as_view(),name='checkout'),
    path('user/orders/my-orders/',MyOrdersView.as_view(),name='orders'),
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('user/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('active-chats/', ActiveChatsView.as_view(), name='active-chats'),
]
