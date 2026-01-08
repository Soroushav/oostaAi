from rest_framework import serializers
from carts.models import Cart, CartItem


class CartItemReadSerializer(serializers.ModelSerializer):
    option_id = serializers.IntegerField(source="option.id", read_only=True)
    subscription_type = serializers.CharField(source="option.subscription_type", read_only=True)
    duration_months = serializers.IntegerField(source="option.duration_months", read_only=True)
    delivery_mode = serializers.CharField(source="option.delivery_mode", read_only=True)
    price = serializers.DecimalField(source="option.price", max_digits=12, decimal_places=2, read_only=True)

    product = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = [
            "id",
            "quantity",
            "option_id",
            "subscription_type",
            "duration_months",
            "delivery_mode",
            "price",
            "target_email",   # ✅ اضافه شد
            "product",
        ]

    def get_product(self, obj):
        if not obj.option_id:
            return None
        p = obj.option.product
        return {"id": p.id, "title": p.title, "slug": p.slug}


class CartReadSerializer(serializers.ModelSerializer):
    items = CartItemReadSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = ["id", "token", "status", "items"]
