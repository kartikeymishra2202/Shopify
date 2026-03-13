import requests
from rest_framework.generics import ListAPIView,RetrieveAPIView
from django_filters import rest_framework as filters
from rest_framework.views import APIView
from django.db import transaction, connection
from .models import Product,Cart,CartItem,Order,OrderItem,Category
from .serializers import ProductSerializer,CartSerializer,OrderSerializer,CategorySerializer, ProductCreateSerializer
from django.shortcuts import get_object_or_404
from .auth_serializers import UserRegistrationSerializer, UserLoginSerializer


from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from store.auth_serializers import (
    UserRegistrationSerializer,
    UserLoginSerializer,
    UserProfileSerializer,
    UserChangePasswordSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer,
)
from django.contrib.auth import authenticate
from store.renderers import UserRenderer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import AuthenticationFailed
from rest_framework.permissions import IsAuthenticated,IsAdminUser,AllowAny
from rest_framework import filters as drf_filters 
from django_filters import rest_framework as django_filters
from .models import ChatMessage, User
from django.conf import settings
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .tasks import send_password_reset_email
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode




def get_tokens_for_user(user):
    if not user.is_active:
      raise AuthenticationFailed("User is not active")

    refresh = RefreshToken.for_user(user)

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

# Create your views here.
class UserRegistrationView(APIView):
    renderer_classes=[UserRenderer]
    def post(self,request,format=None):
        serializer=UserRegistrationSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user=serializer.save()
            token=get_tokens_for_user(user)
            return Response({
                    "token": token,
                    "user": {
                        "id": user.id,
                        "name": user.name,
                        "email": user.email,
                        "role": "user",
                    },
                    "msg": "Registration Successful"
                },status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


class UserLoginView(APIView):
    renderer_classes=[UserRenderer]
    def post(self,request,format=None):
        serializer=UserLoginSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            email=serializer.validated_data.get('email')
            password=serializer.validated_data.get('password')
            user=authenticate(email=email,password=password)
            if user is not None:
                token=get_tokens_for_user(user)

                return Response({
                    "token": token,
                    "user": {
                        "id": user.id,
                        "name": user.name,
                        "email": user.email,
                        "role": "admin" if user.is_staff else "user",
                    },
                    "msg": "Login Success"
                },status=status.HTTP_200_OK)
            else:
                return Response({'error':{'non_field_error':['Email or Password is not Valid']}},status=status.HTTP_404_NOT_FOUND)

        return Response({})


class Auth0BackendCallbackView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        code = request.data.get("code")
        if not code:
            return Response({"error": "Missing authorization code"}, status=status.HTTP_400_BAD_REQUEST)

        missing = [
            key for key, value in {
                "AUTH0_DOMAIN": settings.AUTH0_DOMAIN,
                "AUTH0_CLIENT_ID": settings.AUTH0_CLIENT_ID,
                "AUTH0_CLIENT_SECRET": settings.AUTH0_CLIENT_SECRET,
                "AUTH0_REDIRECT_URI": settings.AUTH0_REDIRECT_URI,
            }.items() if not value
        ]
        if missing:
            return Response(
                {"error": f"Missing Auth0 settings: {', '.join(missing)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        token_payload = {
            "grant_type": "authorization_code",
            "client_id": settings.AUTH0_CLIENT_ID,
            "client_secret": settings.AUTH0_CLIENT_SECRET,
            "code": code,
            "redirect_uri": settings.AUTH0_REDIRECT_URI,
        }
        if settings.AUTH0_AUDIENCE:
            token_payload["audience"] = settings.AUTH0_AUDIENCE

        try:
            token_res = requests.post(
                f"https://{settings.AUTH0_DOMAIN}/oauth/token",
                json=token_payload,
                timeout=15,
            )
            token_data = token_res.json()
        except requests.RequestException:
            return Response({"error": "Auth0 token exchange failed"}, status=status.HTTP_502_BAD_GATEWAY)

        if token_res.status_code >= 400:
            return Response(
                {"error": "Auth0 token exchange rejected", "details": token_data},
                status=status.HTTP_400_BAD_REQUEST,
            )

        access_token = token_data.get("access_token")
        if not access_token:
            return Response(
                {"error": "Auth0 did not return access token"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user_info_res = requests.get(
                f"https://{settings.AUTH0_DOMAIN}/userinfo",
                headers={"Authorization": f"Bearer {access_token}"},
                timeout=15,
            )
            user_info = user_info_res.json()
        except requests.RequestException:
            return Response({"error": "Failed to fetch Auth0 user info"}, status=status.HTTP_502_BAD_GATEWAY)

        if user_info_res.status_code >= 400:
            return Response(
                {"error": "Auth0 user info rejected", "details": user_info},
                status=status.HTTP_400_BAD_REQUEST,
            )

        auth0_subject = user_info.get("sub")
        email = user_info.get("email")
        if not email:
            return Response({"error": "Auth0 account has no email"}, status=status.HTTP_400_BAD_REQUEST)

        display_name = user_info.get("name") or user_info.get("nickname") or email.split("@")[0]

        user = User.objects.filter(auth0_subject=auth0_subject).first() if auth0_subject else None
        if not user:
            user = User.objects.filter(email__iexact=email).first()

        if not user:
            user = User.objects.create_user(email=email, name=display_name, password=None)

        if auth0_subject and user.auth0_subject != auth0_subject:
            if User.objects.filter(auth0_subject=auth0_subject).exclude(id=user.id).exists():
                return Response(
                    {"error": "Auth0 account already linked to another user"},
                    status=status.HTTP_409_CONFLICT,
                )
            user.auth0_subject = auth0_subject
            user.save(update_fields=["auth0_subject"])

        token = get_tokens_for_user(user)
        return Response(
            {
                "token": token,
                "user": {
                    "id": user.id,
                    "name": user.name,
                    "email": user.email,
                    "role": "admin" if user.is_staff else "user",
                },
                "msg": "Auth0 login success",
            },
            status=status.HTTP_200_OK,
        )

class UserProfileView(APIView):
    renderer_classes=[UserRenderer]
    permission_classes=[IsAuthenticated]
    def get(self,request,format=None):
        serializer=UserProfileSerializer(request.user)
        
        return Response(serializer.data,status=status.HTTP_200_OK)
    
class UserChangePasswordView(APIView):
    renderer_classes=[UserRenderer]
    permission_classes=[IsAuthenticated]
    def post(self,request,format=None):
        serializer=UserChangePasswordSerializer(data=request.data,context={'user':request.user})
        
        if serializer.is_valid(raise_exception=True):
            return Response({'msg':'Password Changed Successfully'},status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        send_password_reset_email.delay(serializer.validated_data["email"])
        return Response(
            {"msg": "If the account exists, a reset email has been queued."},
            status=status.HTTP_202_ACCEPTED,
        )


class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        uid = serializer.validated_data["uid"]
        token = serializer.validated_data["token"]
        password = serializer.validated_data["password"]

        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.filter(pk=user_id).first()
        except Exception:
            user = None

        if not user or not default_token_generator.check_token(user, token):
            return Response(
                {"error": "Invalid or expired reset link."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(password)
        user.save(update_fields=["password"])
        return Response({"msg": "Password reset successful."}, status=status.HTTP_200_OK)


# Authentication Complete ---------------


class ProductFilter(filters.FilterSet):
    price_min = filters.NumberFilter(field_name="price", lookup_expr='gte')
    price_max = filters.NumberFilter(field_name="price", lookup_expr='lte')
    category = filters.CharFilter(field_name="category__slug", lookup_expr='iexact')

    class Meta:
        model = Product
        fields = ['category', 'price_min', 'price_max']


class ProductListView(ListAPIView):
    serializer_class = ProductSerializer
    filterset_class = ProductFilter
    
    
    filter_backends = [
        django_filters.DjangoFilterBackend, 
        drf_filters.SearchFilter, 
        drf_filters.OrderingFilter
    ]
    
    
    search_fields = ['title', 'description']
    ordering_fields = ['price', 'created_at']

    def get_queryset(self):
        return (
            Product.objects
            .filter(is_active=True)
            .select_related('category')
        )
    
class CategoryListView(APIView):
    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

class ProductDetailView(RetrieveAPIView):
    serializer_class = ProductSerializer
    lookup_field = "slug"

    def get_queryset(self):
        return Product.objects.filter(is_active=True).select_related("category")


class AdminProductCreateView(APIView):
    permission_classes = [IsAdminUser]
    # Accept JSON payloads for link-based images (and keep form/multipart for compatibility).
    parser_classes = [JSONParser, FormParser, MultiPartParser]

    def post(self, request, format=None):
        serializer = ProductCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product = serializer.save()
        response_serializer = ProductSerializer(product, context={'request': request})
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)
    
class CartSyncView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart, created = Cart.objects.get_or_create(user=request.user)
        
        serializer = CartSerializer(cart, context={'request': request})
        
        return Response(serializer.data)

    def post(self, request):
        local_items = request.data.get('items', []) 
        cart, _ = Cart.objects.get_or_create(user=request.user)

    
        new_item_ids = [item.get('product_id') for item in local_items if item.get('product_id')]
        cart.items.exclude(product_id__in=new_item_ids).delete()

    
        for item in local_items:
            try:
                product = Product.objects.get(id=item['product_id'])
                cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
                cart_item.quantity = item['quantity'] 
                cart_item.save()
            except Product.DoesNotExist:
                continue 
    
        serializer = CartSerializer(cart, context={'request': request})
        return Response(serializer.data)
    
class CheckoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        data = request.data 
        try:
            cart = Cart.objects.get(user=user)
        except Cart.DoesNotExist:
            return Response({"error": "Cart is empty"}, status=400)

        cart_items = cart.items.select_related("product")
        if not cart_items.exists():
            return Response({"error": "Cart is empty"}, status=400)

        try:
            with transaction.atomic():
                product_ids = list(cart_items.values_list("product_id", flat=True))
                product_queryset = Product.objects.filter(id__in=product_ids)
                if connection.vendor != "sqlite":
                    product_queryset = product_queryset.select_for_update()
                products_by_id = {product.id: product for product in product_queryset}

                for item in cart_items:
                    product = products_by_id.get(item.product_id)
                    if not product or not product.is_active:
                        raise ValueError(f"Product not available (id={item.product_id}).")
                    if product.stock < item.quantity:
                        raise ValueError(
                            f"Insufficient stock for '{product.title}'. "
                            f"Available={product.stock}, requested={item.quantity}."
                        )

                order = Order.objects.create(
                    user=user,
                    full_name=data.get("full_name"),
                    email=data.get("email"),
                    address=data.get("address"),
                    total_amount=data.get("total_amount"),
                )

                for item in cart_items:
                    product = products_by_id[item.product_id]
                    product.stock -= item.quantity
                    product.save(update_fields=["stock"])
                    OrderItem.objects.create(
                        order=order,
                        product=product,
                        price=product.price,
                        quantity=item.quantity,
                    )

                cart_items.delete()
        except ValueError as exc:
            return Response({"error": str(exc)}, status=400)

        return Response({"msg": "Order placed successfully", "order_id": order.id})
    
class MyOrdersView(ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')
    
class ActiveChatsView(APIView):
    """
    View for Admin to get a list of all unique users 
    who have initiated a chat.
    """
    permission_classes = [IsAdminUser]

    def get(self, request):
        # 1. Get unique IDs of users who sent messages to Admin (ID 1)
        # We use .distinct() to ensure each user appears only once
        user_ids = ChatMessage.objects.filter(
            receiver_id=request.user.id
        ).values_list('sender_id', flat=True).distinct()

        # 2. Fetch the actual user objects
        users = User.objects.filter(id__in=user_ids)

        # 3. Format the data for the Admin Sidebar
        # You could also use a UserSerializer here if you have one
        data = [
            {
                "id": u.id, 
                "name": u.name if hasattr(u, 'name') else u.username, 
                "email": u.email
            } 
            for u in users
        ]

        return Response(data)
