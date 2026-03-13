from rest_framework import serializers
from .models import Product, Category,Cart, CartItem,Order,OrderItem
from django.conf import settings

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id',
            'title',
            'slug',
            'description',
            'price',
            'image',
            'stock',
            'category',
        ]

    def get_image(self, obj):
        value = obj.image
        if not value:
            return None

        # If it's already an external link, return as-is.
        if isinstance(value, str) and (value.startswith("http://") or value.startswith("https://")):
            return value

        # Handle relative paths by building absolute URI.
        # relative media paths (e.g. "products/foo.jpg").
        request = self.context.get('request')
        if not request:
            return value

        if isinstance(value, str) and value.startswith("/"):
            return request.build_absolute_uri(value)

        media_url = getattr(settings, "MEDIA_URL", "/media/")
        if not media_url.endswith("/"):
            media_url += "/"
        return request.build_absolute_uri(f"{media_url}{value}")


class ProductCreateSerializer(serializers.ModelSerializer):
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True
    )

    class Meta:
        model = Product
        fields = [
            'id',
            'title',
            'description',
            'price',
            'image',
            'stock',
            'is_active',
            'category_id',
        ]

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True) 
    
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'quantity', 'total_price']

    def get_total_price(self, obj):
        return obj.product.price * obj.quantity

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    cart_total = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'items', 'cart_total']

    def get_cart_total(self, obj):
        return sum(item.product.price * item.quantity for item in obj.items.all())
    

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.title')
    product_image = serializers.ReadOnlyField(source='product.image')

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'product_image', 'price', 'quantity']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'items', 'total_amount', 'status', 'created_at', 'full_name', 'address']
