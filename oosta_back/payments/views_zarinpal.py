from decimal import Decimal
from django.db import transaction
from django.urls import reverse
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from orders.models import Order
from payments.models import Payment
from payments.exceptions import EmailNotVerified
from payments.serializers import ZarinpalRequestSerializer
from payments.services.zarinpal import ZarinpalClient


class ZarinpalRequestView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        if request.user.email_verified_at is None:
            raise EmailNotVerified()

        ser = ZarinpalRequestSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        order_id = ser.validated_data["order_id"]

        try:
            order = (
                Order.objects
                .prefetch_related("items")
                .get(id=order_id, user=request.user)
            )
        except Order.DoesNotExist:
            return Response({"detail": "Order not found."}, status=status.HTTP_404_NOT_FOUND)

        if order.status == Order.Status.PAID:
            return Response({"detail": "Order already paid."}, status=status.HTTP_409_CONFLICT)
        if order.status in (Order.Status.DELIVERED, Order.Status.CANCELED):
            return Response({"detail": "Order is not payable."}, status=status.HTTP_409_CONFLICT)
        if order.status != Order.Status.PENDING:
            return Response({"detail": "Order is not payable."}, status=status.HTTP_409_CONFLICT)

        amount_toman = Decimal("0")
        for item in order.items.all():
            amount_toman += (item.unit_price_snapshot * item.quantity)

        amount_rial = int(amount_toman * 10)

        if amount_rial < 10000:
            return Response({"detail": "Amount is below minimum."}, status=status.HTTP_400_BAD_REQUEST)

        active = (
            Payment.objects
            .filter(order=order, provider=Payment.Provider.ZARINPAL, status__in=[Payment.Status.INITIATED, Payment.Status.REDIRECTED])
            .order_by("-id")
            .first()
        )
        if active and active.authority:
            client = ZarinpalClient()
            return Response(
                {
                    "payment_id": active.id,
                    "order_id": order.id,
                    "amount_toman": str(active.amount_toman),
                    "authority": active.authority,
                    "payment_url": client.startpay_url(active.authority),
                },
                status=status.HTTP_200_OK,
            )

        payment = Payment.objects.create(
            order=order,
            provider=Payment.Provider.ZARINPAL,
            status=Payment.Status.INITIATED,
            amount_toman=amount_toman,
            amount_rial=amount_rial,
        )

        callback_url = request.build_absolute_uri(reverse("zarinpal-callback"))

        description = f"Order #{order.id}"

        client = ZarinpalClient()
        req_payload, zresp = client.request_payment(
            amount_rial=amount_rial,
            callback_url=callback_url,
            description=description,
            metadata={
                "email": request.user.email,
            },
        )

        payment.request_payload = req_payload
        payment.request_response = zresp

        data = (zresp or {}).get("data") or {}
        code = data.get("code")
        authority = data.get("authority")

        if code != 100 or not authority:
            payment.mark_failed()
            payment.save(update_fields=["request_payload", "request_response", "status", "failed_at", "updated_at"])
            return Response(
                {
                    "detail": "Payment request failed.",
                    "zarinpal_code": code,
                    "errors": (zresp or {}).get("errors"),
                },
                status=status.HTTP_502_BAD_GATEWAY,
            )

        payment.authority = authority
        payment.status = Payment.Status.REDIRECTED
        payment.save(update_fields=["request_payload", "request_response", "authority", "status", "updated_at"])

        return Response(
            {
                "payment_id": payment.id,
                "order_id": order.id,
                "amount_toman": str(amount_toman),
                "authority": authority,
                "payment_url": client.startpay_url(authority),
            },
            status=status.HTTP_200_OK,
        )
