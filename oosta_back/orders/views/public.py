from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from orders.models import Order
from orders.serializers.public import OrderListSummarySerializer, OrderDetailSerializer
from rest_framework.views import APIView
from rest_framework.response import Response


class OrderListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderListSummarySerializer

    def get_queryset(self):
        return (
            Order.objects
            .filter(user=self.request.user)
            .prefetch_related("items__option__product")
            .order_by("-id")
        )


class OrderDetailView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderDetailSerializer
    lookup_field = "id"

    def get_queryset(self):
        return (
            Order.objects
            .filter(user=self.request.user)
            .prefetch_related("items__option__product")
        )


class OrderCancelView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, id: int):
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
