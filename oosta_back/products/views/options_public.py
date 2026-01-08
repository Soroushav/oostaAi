from rest_framework import generics
from rest_framework.permissions import AllowAny
from products.models import ProductOption
from products.serializers.options import ProductOptionSerializer


class ProductOptionsListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = ProductOptionSerializer

    def get_queryset(self):
        product_id = self.kwargs["product_id"]
        return ProductOption.objects.filter(product_id=product_id, is_active=True).order_by("duration_months",
                                                                                            "subscription_type",
                                                                                            "delivery_mode")
