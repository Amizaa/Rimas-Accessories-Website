from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils.timezone import now
from .models import *
from .serializers import *
from django.db.models import F, ExpressionWrapper, DecimalField
from django.contrib.auth import logout
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
import random
from kavenegar import *

class TenPerPagePagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = "page_size"  
    max_page_size = 100

# --- USER & ADDRESS ---
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class AddressViewSet(viewsets.ModelViewSet):
    queryset = Address.objects.all()
    serializer_class = AddressSerializer


# --- CATEGORY & PRODUCTS ---
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


from django.db.models import Min, F, ExpressionWrapper, DecimalField
from django.db.models import Case, When, BooleanField

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    pagination_class = TenPerPagePagination
    

    def get_queryset(self):
        """
        Override to filter by category, search, price range, discount, ids,
        and apply sorting with stock handling.
        """
        queryset = super().get_queryset()
        category_slug = self.request.query_params.get('category')
        search = self.request.query_params.get('search')
        min_price = self.request.query_params.get('minPrice')
        max_price = self.request.query_params.get('maxPrice')
        has_discount = self.request.query_params.get('hasDiscount')
        ids = self.request.query_params.get('ids')
        sort_by = self.request.query_params.get('sortBy')

        # Filter by category
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)

        # Filter by search
        if search:
            queryset = queryset.filter(title__icontains=search)

        # Annotate discounted price
        discounted_price = ExpressionWrapper(
            F('variants__price') - (F('variants__price') * F('discount') / 100),
            output_field=DecimalField(max_digits=10, decimal_places=2)
        )
        queryset = queryset.annotate(final_price=Min(discounted_price))

        # Price filters
        if min_price:
            queryset = queryset.filter(final_price__gte=min_price)
        if max_price:
            queryset = queryset.filter(final_price__lte=max_price)

        # Discount filter
        if has_discount and has_discount.lower() in ['1', 'true', 'yes']:
            queryset = queryset.filter(discount__gt=0)

        # Filter by IDs
        if ids:
            ids_list = [int(pk) for pk in ids.split(",") if pk.isdigit()]
            queryset = queryset.filter(id__in=ids_list)

        # Annotate stock presence
        queryset = queryset.annotate(
            has_stock=Case(
                When(variants__stock__gt=0, then=True),
                default=False,
                output_field=BooleanField()
            )
        )
        
        # Sorting logic
        if sort_by == "date-desc":
            queryset = queryset.order_by(F('has_stock').desc(), F('add_date').desc())
        elif sort_by == "price-asc":
            queryset = queryset.order_by(F('has_stock').desc(), F('final_price').asc())
        elif sort_by == "price-desc":
            queryset = queryset.order_by(F('has_stock').desc(), F('final_price').desc())
        else:
            queryset = queryset.order_by(F('has_stock').desc(), F('add_date').desc())

        return queryset


    @action(detail=False, methods=['get'], url_path='last-added')
    def last_added(self, request):
        """
        Custom endpoint: /api/products/last-added/?limit=5
        """
        limit = request.query_params.get('limit', 5)
        try:
            limit = int(limit)
        except ValueError:
            limit = 5

        queryset = Product.objects.order_by('-add_date')[:limit]
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=["post"], url_path="upload-images")
    def upload_images(self, request, pk=None):
        product = self.get_object()
        files = request.FILES.getlist("images")
        is_primary_list = request.data.getlist("is_primary")  # 👈 collect boolean flags

        if not files:
            return Response({"error": "No images uploaded"}, status=400)

        images = []
        for index, file in enumerate(files):
            is_primary = False
            # If `is_primary` values are sent (as strings)
            if len(is_primary_list) > index:
                val = is_primary_list[index]
                is_primary = val in ["true", "True", "1", True]

            # Create image object
            img = ProductImage.objects.create(
                product=product,
                url=file,
                is_primary=is_primary
            )
            images.append(img)

        # Optional: ensure only one image is marked primary
        if any(img.is_primary for img in images):
            ProductImage.objects.filter(product=product).exclude(id__in=[img.id for img in images]).update(is_primary=False)

        serializer = ProductImageSerializer(images, many=True, context={"request": request})
        return Response(serializer.data, status=201)


class ProductVariantViewSet(viewsets.ModelViewSet):
    queryset = ProductVariant.objects.all()
    serializer_class = ProductVariantSerializer
    
class ProductImageViewSet(viewsets.ModelViewSet):
    queryset = ProductImage.objects.all()
    serializer_class = ProductImageSerializer
    
    


# --- BLOG ---
class BlogImageViewSet(viewsets.ModelViewSet):
    queryset = BlogImage.objects.all()
    serializer_class = BlogImageSerializer
    
class BlogPostViewSet(viewsets.ModelViewSet):
    queryset = BlogPost.objects.all().order_by("-published_at")
    serializer_class = BlogPostSerializer
    
    @action(detail=True, methods=["post"], url_path="upload-images")
    def upload_images(self, request, pk=None):
        blog = self.get_object()
        files = request.FILES.getlist("images")  # 👈 multiple files (same key)
        
        if not files:
            return Response({"error": "No images uploaded"}, status=400)

        images = []
        for file in files:
            img = BlogImage.objects.create(blog=blog, url=file)
            images.append(img)

        serializer = BlogImageSerializer(images, many=True, context={"request": request})
        return Response(serializer.data, status=201)
    
    @action(detail=False, methods=["get"], url_path="by-slug/(?P<slug>[^/.]+)")
    def fetch_by_slug(self, request, slug=None):
        try:
            blog = BlogPost.objects.get(slug=slug)
        except BlogPost.DoesNotExist:
            return Response({"error": "Not found"}, status=404)

        # ✅ Increase views safely
        BlogPost.objects.filter(pk=blog.pk).update(views=F("views") + 1)
        blog.refresh_from_db(fields=["views"])

        serializer = self.get_serializer(blog)
        return Response(serializer.data)
    


# --- PROMO ---
from django.utils.timezone import now
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets

from .models import PromoCode, PromoCodeUser
from .serializers import PromoCodeSerializer


class PromoCodeViewSet(viewsets.ModelViewSet):
    queryset = PromoCode.objects.all()
    serializer_class = PromoCodeSerializer
    
    def get_queryset(self):
        # ✅ Auto-expire codes when fetching
        PromoCode.objects.filter(
            status="active",
            expire_date__lt=now()
        ).update(status="expired")

        return super().get_queryset()

    @action(detail=False, methods=['post'])
    def apply(self, request):
        """Validate promo code for a given user (don't mark as used yet)"""
        code = request.data.get('code')
        user_id = request.data.get('user_id')

        if not code:
            return Response({'error': 'کد تخفیف الزامی است'}, status=400)

        try:
            promo = PromoCode.objects.get(code=code, status='active', expire_date__gte=now())
        except PromoCode.DoesNotExist:
            return Response({'error': 'کد تخفیف معتبر نیست'}, status=400)

        # Check if linked to user
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({'error': 'کاربر یافت نشد'}, status=400)

        if promo.is_global:
            # Global promo: create link if first-time user
            link, _ = PromoCodeUser.objects.get_or_create(promo=promo, user=user)
        else:
            # User-specific: must already exist
            try:
                link = PromoCodeUser.objects.get(promo=promo, user=user)
            except PromoCodeUser.DoesNotExist:
                return Response({'error': 'کد تخفیف معتبر نیست'}, status=400)

        if link.used:
            return Response({'error': 'شما قبلا این کد تخفیف را استفاده کرده‌اید'}, status=400)

        # ✅ Just validate here (do NOT mark as used yet)
        return Response({
            'id': promo.id,
            'title': promo.title,
            'discount': promo.discount,
            'free_shipping': promo.free_shipping
        })



class PromoCodeUserViewSet(viewsets.ModelViewSet):
    serializer_class = PromoCodeUserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        now = timezone.now()
        user = self.request.user

        user_id = self.request.query_params.get('user_id')
        if (user.is_staff or user.is_superuser) and user_id:
            # Admins can fetch promo codes for any user
            return PromoCodeUser.objects.filter(
                user_id=user_id,
            )
        elif user.is_staff or user.is_superuser:
            return PromoCodeUser.objects.all()
        else:
            # Regular users see only their own
            return PromoCodeUser.objects.filter(
                user=user,
                used=False,
                promo__expire_date__gt=now,
                promo__status="active"
            )

    def perform_create(self, serializer):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            serializer.save()
        else:
            serializer.save(user=user)



# --- ORDER ---
class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Order.objects.all() if user.is_staff or user.is_superuser else Order.objects.filter(user=user)

        # Filter by user_id query param (only allowed for staff/superuser)
        user_id = self.request.query_params.get("user_id")
        if user_id and (user.is_staff or user.is_superuser):
            queryset = queryset.filter(user__id=user_id)

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True  # ✅ ensure partial updates work
        return super().update(request, *args, **kwargs)


class OrderItemViewSet(viewsets.ModelViewSet):
    serializer_class = OrderItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return OrderItem.objects.all()
        return OrderItem.objects.filter(order__user=user)

    def perform_create(self, serializer):
        variant = serializer.validated_data.get('variant')
        product = variant.product
        category_name = product.category.name if product.category else ""

        serializer.save(
            variant_title=variant.title,
            product_title=product.title,
            product_category=category_name,
            price=variant.price,       # قیمت در لحظه خرید
            discount=variant.discount, # تخفیف فعلی
        )


# class LoginView(APIView):
#     def post(self, request):
#         phone = request.data.get("phone")
#         if not phone:
#             return Response({"error": "Phone number is required"}, status=400)

#         user, created = User.objects.get_or_create(phone=phone)

#         login(request, user)  # only pass the user object

#         refresh = RefreshToken.for_user(user)
#         return Response({
#             "refresh": str(refresh),
#             "access": str(refresh.access_token),
#             "user": {
#                 "id": user.id,
#                 "phone": user.phone,
#             }
#         })

import random
from django.core.cache import cache
from rest_framework_simplejwt.tokens import RefreshToken

class RequestOTPView(APIView):
    def post(self, request):
        phone = request.data.get("phone")
        if not phone:
            return Response({"error": "Phone number is required"}, status=400)

        otp_code = str(random.randint(100000, 999999))
        
        print(otp_code)

        # Store OTP in cache (phone → code)
        cache.set(phone, otp_code, timeout=120) 

        print(cache.get(phone))
        return Response({"message": "OTP sent successfully"})


class VerifyOTPView(APIView):
    def post(self, request):
        phone = request.data.get("phone")
        code = request.data.get("code")

        if not phone or not code:
            return Response({"error": "Phone and code are required"}, status=400)

        cached_code = int(cache.get(phone))
        
        if not cached_code or cached_code != code:
            return Response({"error": "Invalid or expired code"}, status=400)

        # OTP is valid → create user if needed
        user, created = User.objects.get_or_create(phone=phone)

        # Generate JWT
        refresh = RefreshToken.for_user(user)
        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {
                "id": user.id,
                "phone": user.phone,
                "is_staff": user.is_staff
            }
        })

        
class LogoutView(APIView):
    
    def post(self, request):
        logout(request)
        return Response({"message": "Logged out successfully"})

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    




