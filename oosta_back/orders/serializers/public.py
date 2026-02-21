from rest_framework import serializers
from orders.models import Order, OrderItem


class OrderItemSummarySerializer(serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    target_email_snapshot = serializers.EmailField(read_only=True)

    class Meta:
        model = OrderItem
        fields = ["id", "title", "quantity", "target_email_snapshot"]

    def get_title(self, obj):
        return obj.option.product.title


class OrderListSummarySerializer(serializers.ModelSerializer):
    items = OrderItemSummarySerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ["id", "status", "created_at", "total_price", "items"]

    def get_total_price(self, obj):
        return sum(i.quantity * i.unit_price_snapshot for i in obj.items.all())


class OrderItemDetailSerializer(serializers.ModelSerializer):
    product = serializers.SerializerMethodField()
    option = serializers.SerializerMethodField()
    line_total = serializers.SerializerMethodField()
    target_email_snapshot = serializers.EmailField(read_only=True)

    class Meta:
        model = OrderItem
        fields = [
            "id",
            "product",
            "option",
            "quantity",
            "unit_price_snapshot",
            "line_total",
            "target_email_snapshot",
        ]

    def get_product(self, obj):
        p = obj.option.product
        return {"id": p.id, "title": p.title}

    def get_option(self, obj):
        o = obj.option
        return {
            "id": o.id,
            "subscription_type": o.subscription_type,
            "duration_months": o.duration_months,
            "delivery_mode": o.delivery_mode,
        }

    def get_line_total(self, obj):
        return obj.quantity * obj.unit_price_snapshot


class OrderDetailSerializer(serializers.ModelSerializer):
    items = OrderItemDetailSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ["id", "status", "created_at", "items", "total_price"]

    def get_total_price(self, obj):
        return sum(i.quantity * i.unit_price_snapshot for i in obj.items.all())
