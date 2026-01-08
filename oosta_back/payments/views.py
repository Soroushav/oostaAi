from decimal import Decimal

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from orders.models import Order
from .exceptions import EmailNotVerified


class PaymentEntryView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.email_verified_at is None:
            raise EmailNotVerified()

        order_id = request.data.get("order_id")
        if not order_id:
            return Response({"detail": "order_id is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            order = Order.objects.prefetch_related("items").get(id=order_id, user=request.user)
        except Order.DoesNotExist:
            return Response({"detail": "Order not found."}, status=status.HTTP_404_NOT_FOUND)

        if order.status == Order.Status.PAID:
            return Response({"payment_state": "already_paid", "order_id": order.id}, status=status.HTTP_200_OK)

        if order.status == Order.Status.DELIVERED:
            return Response({"detail": "Order is already delivered and not payable."}, status=status.HTTP_409_CONFLICT)

        if order.status == Order.Status.CANCELED:
            return Response({"detail": "Order is canceled and not payable."}, status=status.HTTP_409_CONFLICT)

        if order.status != Order.Status.PENDING:
            return Response({"detail": "Order is not payable."}, status=status.HTTP_409_CONFLICT)

        amount = Decimal("0")
        for item in order.items.all():
            amount += (item.unit_price_snapshot * item.quantity)

        return Response(
            {
                "payment_state": "requires_gateway",
                "order_id": order.id,
                "amount": str(amount),
            },
            status=status.HTTP_200_OK,
        )
