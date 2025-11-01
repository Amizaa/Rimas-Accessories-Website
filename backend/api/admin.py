from django.contrib import admin
from .models import User, Address, Category, Product, ProductVariant, BlogPost, PromoCode, PromoCodeUser, Order, OrderItem, ProductImage, OTP, BlogImage
# Register your models here.

admin.site.register(User)
admin.site.register(Address)
admin.site.register(Category)
admin.site.register(Product)
admin.site.register(ProductImage)
admin.site.register(BlogPost)
admin.site.register(BlogImage)
admin.site.register(PromoCode)
admin.site.register(PromoCodeUser)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(OTP)


class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['product', 'variant', 'quantity']

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "variant" and request.resolver_match.kwargs.get("object_id"):
            try:
                obj_id = request.resolver_match.kwargs["object_id"]
                product_id = OrderItem.objects.get(pk=obj_id).product_id
                kwargs["queryset"] = ProductVariant.objects.filter(product_id=product_id)
            except OrderItem.DoesNotExist:
                pass
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

class ProductVariantAdmin(admin.ModelAdmin):
    list_display = ('title', 'product', 'display_price', 'stock')

    def display_price(self, obj):
        return obj.get_price()
    display_price.short_description = 'Price'

admin.site.register(ProductVariant, ProductVariantAdmin)