from django.db.models import Prefetch
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework.pagination import PageNumberPagination

from orders.models import Order, OrderItem
from orders.serializers.public import OrderListSummarySerializer, OrderDetailSerializer


class OrdersPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 50


class OrderListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderListSummarySerializer
    pagination_class = OrdersPagination

    def get_queryset(self):
        qs = (
            Order.objects
            .filter(user=self.request.user)
            .order_by("-id")
            .prefetch_related(
                Prefetch(
                    "items",
                    queryset=OrderItem.objects.select_related("option__product").order_by("id"),
                )
            )
        )

        status_param = self.request.query_params.get("status")
        if status_param:
            allowed = {choice.value for choice in Order.Status}  # pending/paid/delivered/canceled
            if status_param not in allowed:
                raise ValidationError({"status": f"Invalid status. Allowed: {sorted(allowed)}"})
            qs = qs.filter(status=status_param)

        return qs


class OrderDetailView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderDetailSerializer
    lookup_field = "id"

    def get_queryset(self):
        return (
            Order.objects
            .filter(user=self.request.user)
            .prefetch_related(
                Prefetch(
                    "items",
                    queryset=OrderItem.objects.select_related("option__product").order_by("id"),
                )
            )
        )


class OrderCancelView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, id):
        try:
            order = Order.objects.get(id=id, user=request.user)
        except Order.DoesNotExist:
            return Response({"detail": "Order not found."}, status=status.HTTP_404_NOT_FOUND)

        if order.status != Order.Status.PENDING:
            return Response(
                {"detail": "Only pending orders can be canceled."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        order.status = Order.Status.CANCELED
        order.save(update_fields=["status"])

        return Response({"id": order.id, "status": order.status}, status=status.HTTP_200_OK)
