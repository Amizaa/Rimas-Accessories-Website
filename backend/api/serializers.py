from rest_framework import serializers
from .models import (
    User, Address, Category, Product, ProductVariant, BlogPost, PromoCode, PromoCodeUser,
    Order, OrderItem, ProductImage, BlogImage
)

# --- USER & ADDRESS ---
class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    addresses = AddressSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = '__all__'


# --- CATEGORY & PRODUCTS ---
class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()
    class Meta:
        model = Category
        fields = '__all__'
        
    def get_product_count(self, obj):
        return obj.products.count()


class ProductVariantSerializer(serializers.ModelSerializer):
    product_id = serializers.PrimaryKeyRelatedField(
        source='product',
        queryset=Product.objects.all(),
        write_only=True,
        required=False
    )
    class Meta:
        model = ProductVariant
        fields = ['id', 'title', 'price', 'stock', 'product_id']

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["id", "url","is_primary"]
        

class ProductSerializer(serializers.ModelSerializer):
    features = serializers.ListField(
        child=serializers.CharField(),
        allow_empty=True,
        required=False
    )
    variants = ProductVariantSerializer(many=True)
    images = ProductImageSerializer(many=True, read_only=True)
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True
    )
    price = serializers.SerializerMethodField()  
    stock_status = serializers.SerializerMethodField()  

    class Meta:
        model = Product
        fields = [
            'id',
            'title',
            'features',
            'price',          
            'category',
            'category_id',
            'images',
            'discount',
            'add_date',
            'variants',
            'stock_status'
        ]

    def get_price(self, obj):
        """
        کمترین قیمت بین Variantها (بدون تخفیف)
        """
        variants = obj.variants.all()
        if not variants.exists():
            return None
        min_price = variants.order_by('price').first().price
        return float(min_price)
    
    def get_stock_status(self, obj):
        return obj.variants.filter(stock__gt=0).exists()

    def create(self, validated_data):
        variants_data = validated_data.pop('variants', [])
        product = Product.objects.create(**validated_data)
        for variant_data in variants_data:
            ProductVariant.objects.create(product=product, **variant_data)
        return product

    def update(self, instance, validated_data):
        variants_data = validated_data.pop('variants', [])
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if variants_data:
            instance.variants.all().delete()
            for variant_data in variants_data:
                ProductVariant.objects.create(product=instance, **variant_data)

        return instance




# --- BLOG ---
class BlogImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogImage
        fields = ["id", "url"]
        
class BlogPostSerializer(serializers.ModelSerializer):
    tags = serializers.ListField(
        child=serializers.CharField(),
        allow_empty=True,
        required=False
    )
    images = BlogImageSerializer(many=True, read_only=True)
    class Meta:
        model = BlogPost
        fields = '__all__'


# --- PROMO ---
class PromoCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PromoCode
        fields = '__all__'


class PromoCodeUserSerializer(serializers.ModelSerializer):
    promo = PromoCodeSerializer(read_only=True)
    promo_id = serializers.PrimaryKeyRelatedField(
        queryset=PromoCode.objects.all(), source='promo', write_only=True
    )

    class Meta:
        model = PromoCodeUser
        fields = ['id', 'promo', 'promo_id', 'user', 'used']


# --- ORDER ---


class OrderItemSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = [
            'id',
            'variant_title',
            'product_title',
            'product_category',
            'discount',
            'quantity',
            'price',
            'image',
        ]
        read_only_fields = ['id','order']

    def get_image(self, obj):
        # تلاش برای پیدا کردن محصول بر اساس عنوان
        if obj.product_title:
            product = Product.objects.filter(title=obj.product_title).first()

        if not product:
            return None

        # پیدا کردن تصویر اصلی یا اولین تصویر موجود
        primary_image = product.images.filter(is_primary=True).first() or product.images.first()
        if not primary_image:
            return None

        image_url = primary_image.url
        print(primary_image.url)
        request = self.context.get('request')
        if request:
            # به جای build_absolute_uri که مسیر را اشتباه می‌سازد:
            return f"{request.scheme}://{request.get_host()}/media/{image_url}"

        return image_url




class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    user = UserSerializer(read_only=True)
    address = serializers.JSONField(required=False, allow_null=True)
    promo_used = serializers.JSONField(required=False, allow_null=True)
    total_amount = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            'id', 'user', 'address', 'description',
            'order_date','shipping_cost', 'shipping_method','promo_used',
            'tracking_code', 'status','shipped_date', 'items','total_amount'
        ]
        read_only_fields = ['id', 'order_date']
        
    def get_total_amount(self, obj):
        total = 0
        for item in obj.items.all():
            item_price = float(item.price)
            discount = float(item.discount or 0)
            quantity = item.quantity

            discounted_price = item_price - (item_price * discount / 100)
            total += discounted_price * quantity


        if obj.promo_used:  
            promo_discount = float(obj.promo_used['discount'] or 0)
            if promo_discount > 0:
                total = total - (total * promo_discount / 100)

        total += float(obj.shipping_cost or 0)
        
        return round(total, 2)

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user if request and request.user.is_authenticated else None
    
        items_data = validated_data.pop('items', [])
        promo_id = validated_data.pop('promo_used', None)
        address_id = validated_data.pop('address', None)

        if promo_id:
            promo_obj = PromoCode.objects.filter(id=promo_id).first()
            if promo_obj:
                validated_data['promo_used'] =  {
                    "code": promo_obj.code,
                    "title": promo_obj.title,
                    "discount": promo_obj.discount,
                    "free_shipping": promo_obj.free_shipping,
                    }
                # str(promo_obj)

                if user:
                    promo_link = PromoCodeUser.objects.filter(
                        promo=promo_obj, user=user, used=False
                    ).first()
                    if promo_link:
                        promo_link.used = True
                        promo_link.save()
            else:
                validated_data['promo_used'] = str(promo_id)

    # 🏠 اگر آدرس از طریق id ارسال شده باشد
        if address_id:
            address_obj = Address.objects.filter(id=address_id, user=user).first()
            if address_obj:
                validated_data['address'] = {
                    "id": address_obj.id,
                    "receiver_name": address_obj.receiver_name,
                    "receiver_phone": address_obj.receiver_name,
                    "province": address_obj.province,
                    "city": address_obj.city,
                    "postal_code": address_obj.postal_code,
                    "address_detail": address_obj.address_detail,
                }
            else:
                # اگر آدرس یافت نشد، مقدار id را به صورت json ذخیره کن
                validated_data['address'] = {"id": address_id}
                
        order = Order.objects.create(**validated_data)

        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)

        return order

        

    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', None)

        # ✅ allow partial updates
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if items_data is not None:
            # If you want to replace items fully
            instance.items.all().delete()
            for item_data in items_data:
                OrderItem.objects.create(order=instance, **item_data)

        return instance
    


