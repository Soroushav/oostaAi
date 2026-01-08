from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from payments.models import Payment
from payments.serializers import PaymentStatusSerializer


class PaymentStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id: int):
        payment = (
            Payment.objects
            .select_related("order")
            .filter(id=id, order__user=request.user)
            .first()
        )
        if not payment:
            return Response({"detail": "Payment not found."}, status=status.HTTP_404_NOT_FOUND)

        payload = {
            "payment_id": payment.id,
            "order_id": payment.order_id,
            "status": payment.status,
            "amount_toman": str(payment.amount_toman),
        }
        if payment.ref_id:
            payload["ref_id"] = payment.ref_id

        ser = PaymentStatusSerializer(payload)
        return Response(ser.data, status=status.HTTP_200_OK)
