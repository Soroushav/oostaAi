from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAdminUser
from products.models import Product, Category, ProductOption
from products.serializers.serializers import ProductSerializer, CategorySerializer, ProductAdminSerializer
from products.serializers.options import ProductOptionSerializer


class CategoryAdminViewSet(ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminUser]


class ProductAdminViewSet(ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductAdminSerializer
    permission_classes = [IsAdminUser]


class AdminProductOptionViewSet(ModelViewSet):
    permission_classes = [IsAdminUser]
    serializer_class = ProductOptionSerializer
    queryset = ProductOption.objects.all().select_related("product").order_by("-id")
