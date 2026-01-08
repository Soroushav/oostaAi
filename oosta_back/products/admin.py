from django.contrib import admin
from .models import Category, Product


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "slug", "is_active", "created_at")
    search_fields = ("title", "slug")
    list_filter = ("is_active",)
    prepopulated_fields = {"slug": ("title",)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "category", "stock", "is_active", "created_at")
    search_fields = ("title", "slug")
    list_filter = ("is_active", "category")
    prepopulated_fields = {"slug": ("title",)}
