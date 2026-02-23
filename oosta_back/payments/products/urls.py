from django.urls import path
from rest_framework.routers import DefaultRouter

from products.views import (
    CategoryPublicViewSet,
    ProductPublicViewSet,
    CategoryAdminViewSet,
    ProductAdminViewSet,
)
from products.views.admin import AdminProductOptionViewSet
from products.views.options_public import ProductOptionsListView

router = DefaultRouter()

router.register("categories", CategoryPublicViewSet, basename="categories")
router.register("products", ProductPublicViewSet, basename="products")

router.register("admin/categories", CategoryAdminViewSet, basename="admin-categories")
router.register("admin/products", ProductAdminViewSet, basename="admin-products")
router.register("admin/options", AdminProductOptionViewSet, basename="admin-options")

urlpatterns = router.urls

urlpatterns += [
    path(
        "products/<int:product_id>/options/",
        ProductOptionsListView.as_view(),
        name="product-options",
    ),
]
