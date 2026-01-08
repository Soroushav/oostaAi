from rest_framework import serializers
from orders.models import Order, OrderItem


class AdminOrderItemSerializer(serializers.ModelSerializer):
    product = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ["id", "product", "quantity", "unit_price_snapshot"]

    def get_product(self, obj):
        return {
            "id": obj.product_id,
            "title": getattr(obj.product, "title", None),
        }


class AdminOrderListSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    items = AdminOrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "user",
            "items",
            "status",
            "created_at",
            "updated_at",
        ]

    def get_user(self, obj):
        return {
            "id": obj.user_id,
            "email": getattr(obj.user, "email", None),
            "is_staff": getattr(obj.user, "is_staff", None),
            "is_guest": getattr(obj.user, "is_guest", False),
        }


class AdminOrderStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ["status"]
