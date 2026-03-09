from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from .models import Product, Category, Cart, CartItem, Order

User = get_user_model()

class StoreEngineTests(APITestCase):
    def setUp(self):
        self.category = Category.objects.create(name="Electronics", slug="electronics")
        self.product = Product.objects.create(
            category=self.category,
            title="Laptop",
            price=50000.00,
            is_active=True,
            stock=10
        )
        
        
        self.user_credentials = {
            "email": "testuser@example.com",
            "password": "Password123",
            "name": "Kartikey"
        }
        self.user = User.objects.create_user(**self.user_credentials)
        self.user.tc = True  
        self.user.save()
        
        
        self.login_url = reverse('login')
        self.product_list_url = reverse('product-list')
        self.checkout_url = reverse('checkout')
        self.profile_url = reverse('profile')

    def get_token(self):
        """Helper to get JWT access token based on your UserLoginView structure"""
        response = self.client.post(self.login_url, {
            "email": self.user_credentials['email'],
            "password": self.user_credentials['password']
        })
        
        return response.data['token']['access']

    
    def test_product_list_and_filtering(self):
        
        response = self.client.get(self.product_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        
        response = self.client.get(self.product_list_url, {'category': 'electronics'})
        self.assertEqual(len(response.data), 1)

    
    def test_profile_access_protection(self):
        
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        
        token = self.get_token()
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    
    def test_checkout_process(self):
        token = self.get_token()
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)
        
        
        cart, _ = Cart.objects.get_or_create(user=self.user)
        CartItem.objects.create(cart=cart, product=self.product, quantity=1)
        
        checkout_data = {
            "full_name": "Kartikey",
            "email": "testuser@example.com",
            "address": "123 Street, Kanpur",
            "total_amount": 50000.00
        }
        
        
        response = self.client.post(self.checkout_url, checkout_data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['msg'], "Order placed successfully")
        
        
        self.assertTrue(Order.objects.filter(user=self.user).exists())
        
        
        self.assertEqual(CartItem.objects.filter(cart=cart).count(), 0)

    def test_empty_cart_checkout_fails(self):
        token = self.get_token()
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)
        
        
        Cart.objects.get_or_create(user=self.user)
        
        response = self.client.post(self.checkout_url, {"full_name": "Test"})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], "Cart is empty")