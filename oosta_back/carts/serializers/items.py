from rest_framework import serializers
from carts.models import CartItem
from products.models import ProductOption


class CartItemCreateSerializer(serializers.Serializer):
    option_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1, default=1)

    def validate_option_id(self, value):
        try:
            opt = ProductOption.objects.select_related("product").get(id=value)
        except ProductOption.DoesNotExist:
            raise serializers.ValidationError("Invalid option_id")

        if not opt.is_active:
            raise serializers.ValidationError("Option is not active")

        # اختیاری: اگر محصولِ option غیرفعال بود
        if hasattr(opt, "product") and hasattr(opt.product, "is_active") and not opt.product.is_active:
            raise serializers.ValidationError("Product is not active")

        return value

    def create(self, validated_data):
        cart = self.context["cart"]
        option_id = validated_data["option_id"]
        qty = validated_data.get("quantity", 1)

        item, created = CartItem.objects.get_or_create(
            cart=cart,
            option_id=option_id,
            defaults={"quantity": qty},
        )
        if not created:
            item.quantity += qty
            item.save(update_fields=["quantity"])
        return item


class CartItemUpdateSerializer(serializers.ModelSerializer):
    """
    PATCH /api/cart/items/<id>/
    - quantity آپدیت می‌شود
    - target_email فقط برای activation مجاز است
    """
    quantity = serializers.IntegerField(required=False, min_value=1)
    target_email = serializers.EmailField(required=False, allow_null=True, allow_blank=True)

    class Meta:
        model = CartItem
        fields = ["quantity", "target_email"]

    def validate(self, attrs):
        # اگر کاربر خواست target_email را تغییر دهد
        if "target_email" in attrs:
            item = self.instance
            if item.option.delivery_mode != "activation":
                raise serializers.ValidationError({
                    "target_email": "target_email is only allowed for activation items."
                })

            if not attrs.get("target_email"):
                raise serializers.ValidationError({
                    "target_email": "target_email is required for activation items."
                })

        return attrs
