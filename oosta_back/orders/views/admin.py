from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from orders.models import Order
from orders.serializers.admin import AdminOrderListSerializer, AdminOrderStatusUpdateSerializer
from products.permissions import IsAdmin


class AdminOrderListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated, IsAdmin]
    serializer_class = AdminOrderListSerializer

    def get_queryset(self):
        return (
            Order.objects
            .select_related("user")
            .prefetch_related("items__product")
            .order_by("-id")
        )


class AdminOrderStatusUpdateView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated, IsAdmin]
    serializer_class = AdminOrderStatusUpdateSerializer
    queryset = Order.objects.all()
    lookup_field = "id"
