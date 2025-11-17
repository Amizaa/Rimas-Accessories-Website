from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

class UserManager(BaseUserManager):
    def create_user(self, phone, password=None, **extra_fields):
        if not phone:
            raise ValueError("Phone number is required")
        user = self.model(phone=phone, **extra_fields)
        user.set_password(password or self.make_random_password())
        user.save(using=self._db)
        return user

    def create_superuser(self, phone, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(phone, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    phone = models.CharField(max_length=15, unique=True)
    first_name = models.CharField(max_length=50, blank=True, default="")
    last_name = models.CharField(max_length=50, blank=True, default="")
    email = models.EmailField(blank=True, null=True)
    signup_date = models.DateTimeField(auto_now_add=True)
    is_staff = models.BooleanField(default=False)
    
    def __str__(self):
        string = ''
        if self.first_name:
            string += self.first_name
            string += ' '
        if self.last_name:
            string += self.last_name
            string += ' '
        if string == '':
            string = self.phone
            
        return string

    USERNAME_FIELD = "phone"
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.phone



# ADDRESSES ---
class Address(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="addresses")
    receiver_name = models.CharField(max_length=150)
    receiver_phone = models.CharField(max_length=20)
    province = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    address_detail = models.TextField()
    postal_code = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.receiver_name} - {self.city}"


# --- CATEGORIES & PRODUCTS ---
class Category(models.Model):
    name = models.CharField(max_length=150, unique=True)
    slug = models.SlugField(max_length=150, unique=True, allow_unicode=True)

    def __str__(self):
        return self.name


class Product(models.Model):
    title = models.CharField(max_length=255)
    features = models.JSONField(default=list, blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name="products")
    discount = models.PositiveSmallIntegerField(default=0)
    add_date = models.DateTimeField(auto_now_add=True)
    

    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ["-add_date"] 
    
class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="images")
    url = models.ImageField(upload_to="products/")
    is_primary = models.BooleanField(default=False)

    def __str__(self):
        return f"Image for {self.product.title}"


class ProductVariant(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="variants")
    title = models.CharField(max_length=255) 
    price = models.DecimalField(max_digits=10, decimal_places=2,null=True, blank=True, default=None)
    stock = models.PositiveIntegerField(default=0)
    
    def get_price(self):
        """
        Return variant's price if set, otherwise return product's base price.
        """
        return self.price if self.price is not None else self.product.price

    def __str__(self):
        return f"{self.title}"


# --- BLOG ---
class BlogPost(models.Model):
    slug = models.SlugField(max_length=150, unique=True, allow_unicode=True)
    title = models.CharField(max_length=255)
    excerpt = models.TextField()
    thumbnail = models.ImageField(upload_to="blog/")
    tags = models.JSONField(default=list, blank=True)
    author = models.CharField(max_length=150)
    published_at = models.DateTimeField(auto_now_add=True)
    views = models.PositiveIntegerField(default=0)
    content_html = models.TextField()
    delta = models.JSONField()

    def __str__(self):
        return self.title
    
class BlogImage(models.Model):
    blog = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name="images")
    url = models.ImageField(upload_to="blog/")

    def __str__(self):
        return f"Image for {self.blog.title}"


# --- PROMOTIONS ---
class PromoCode(models.Model):
    STATUS_CHOICES = [
        ('active', 'فعال'),
        ('expired', 'منقضی شده'),
        ('disabled', 'غیر فعال'),
    ]
    code = models.CharField(max_length=50, unique=True)
    title = models.CharField(max_length=255)
    discount = models.PositiveSmallIntegerField(default=0)  # % discount
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    expire_date = models.DateTimeField()
    free_shipping = models.BooleanField(default=False)
    is_global = models.BooleanField(default=True)

    def __str__(self):
        return self.code


class PromoCodeUser(models.Model):
    promo = models.ForeignKey(PromoCode, on_delete=models.CASCADE, related_name="user_links")
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name="promo_links")
    used = models.BooleanField(default=False)  # True when this user has redeemed it

    class Meta:
        unique_together = ('promo', 'user')

    def __str__(self):
        if self.user:
            return f"{self.promo.code} - {self.user.phone} ({'Used' if self.used else 'Unused'})"
        return f"{self.promo.code} - Global"



# --- ORDERS ---
class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'در حال بررسی'),
        ('canceled', 'لغو شده'),
        ('shipped', 'ارسال شده'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="orders")
    address = models.JSONField(default=dict)
    description = models.TextField(blank=True, null=True)
    order_date = models.DateTimeField(auto_now_add=True)
    shipping_cost = models.DecimalField(max_digits=10,decimal_places=2)
    shipping_method = models.CharField(max_length=100)
    promo_used = models.JSONField(default=dict)
    tracking_code = models.CharField(max_length=100, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    shipped_date = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"Order #{self.id} - {self.user.phone}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    variant_title = models.CharField(max_length=255) 
    product_title = models.CharField(max_length=255)
    product_category = models.CharField(max_length=255)
    discount = models.PositiveSmallIntegerField(default=0)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    

    def __str__(self):
        return f"{self.variant_title} x {self.quantity}"
    
from django.utils import timezone
from datetime import timedelta

class OTP(models.Model):
    phone = models.CharField(max_length=15)
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_expired(self):
        return timezone.now() > self.created_at + timedelta(minutes=2)  # OTP valid 2 min

