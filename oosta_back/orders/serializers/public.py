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


class OrderItemDetailSerializer(serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    target_email_snapshot = serializers.EmailField(read_only=True)
    unit_price_snapshot = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    line_total = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = [
            "id",
            "title",
            "quantity",
            "target_email_snapshot",
            "unit_price_snapshot",
            "line_total",
        ]

    def get_title(self, obj):
        return obj.option.product.title

    def get_line_total(self, obj):
        return obj.quantity * obj.unit_price_snapshot


class OrderListSummarySerializer(serializers.ModelSerializer):
    items_count = serializers.SerializerMethodField()
    first_item_title = serializers.SerializerMethodField()

    total_price = serializers.SerializerMethodField()
    total_amount = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            "id",
            "status",
            "created_at",
            "total_price",
            "total_amount",
            "items_count",
            "first_item_title",
        ]

    def _calc_total(self, obj):
        return sum(i.quantity * i.unit_price_snapshot for i in obj.items.all())

    def get_total_price(self, obj):
        return self._calc_total(obj)

    def get_total_amount(self, obj):
        return self._calc_total(obj)

    def get_items_count(self, obj):
        return obj.items.count()

    def get_first_item_title(self, obj):
        first_item = obj.items.select_related("option__product").order_by("id").first()
        if not first_item:
            return None
        return first_item.option.product.title


class OrderDetailSerializer(serializers.ModelSerializer):
    items = OrderItemDetailSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField()

    payment = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            "id",
            "status",
            "created_at",
            "items",
            "total_price",
            "payment",
        ]

    def get_total_price(self, obj):
        return sum(i.quantity * i.unit_price_snapshot for i in obj.items.all())

    def get_payment(self, obj):
        """
        Payment summary for UI.
        - آخرین Payment را برمی‌داریم.
        - authority را عمداً برنمی‌گردانیم (UI نیاز ندارد).
        """
        p = obj.payments.order_by("-id").first()
        if not p:
            return None

        data = {
            "payment_id": p.id,
            "status": p.status,
            "amount_toman": str(p.amount_toman),
        }

        if p.ref_id:
            data["ref_id"] = p.ref_id
        if p.paid_at:
            data["paid_at"] = p.paid_at

        return data
