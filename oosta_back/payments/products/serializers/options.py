from rest_framework import serializers
from products.models import ProductOption


class ProductOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductOption
        fields = ["id", "product", "subscription_type", "duration_months", "delivery_mode", "price", "is_active"]
        read_only_fields = ["id"]
