from rest_framework import serializers
from products.models import Category, Product
from django.utils.text import slugify


class ProductAdminSerializer(serializers.ModelSerializer):
    category_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Product
        fields = [
            "id", "title", "slug", "description",
            "category_id", "stock", "is_active",
            "created_at",
        ]
        read_only_fields = ["slug", "created_at"]

    def create(self, validated_data):
        if not validated_data.get("slug"):
            validated_data["slug"] = slugify(validated_data["title"])
        return super().create(validated_data)


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "title", "slug"]


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Product
        fields = [
            "id", "title", "slug", "description",
            "stock", "is_active",
            "category", "category_id",
            "created_at",
        ]
        read_only_fields = ["created_at"]
