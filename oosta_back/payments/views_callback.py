from django.conf import settings
from django.db import transaction
from django.shortcuts import redirect
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from payments.services.emails import send_order_paid_email, send_admin_paid_order_email
from orders.models import Order
from payments.models import Payment
from payments.services.zarinpal import ZarinpalClient
from fulfillment.models import Fulfillment, FulfillmentItem

class ZarinpalCallbackView(APIView):
    authentication_classes = []
    permission_classes = []

    @transaction.atomic
    def get(self, request):
        authority = request.query_params.get("Authority", "")
        zstatus = request.query_params.get("Status", "")

        # 1) authority must exist
        if not authority:
            return redirect(f"{settings.FRONTEND_BASE_URL}/payment/result?error=missing_authority")

        # 2) find payment by authority
        payment = Payment.objects.select_related("order").filter(authority=authority).order_by("-id").first()
        if not payment:
            return redirect(f"{settings.FRONTEND_BASE_URL}/payment/result?error=payment_not_found")

        # 3) if already paid -> just redirect (idempotent)
        if payment.status == Payment.Status.PAID:
            return redirect(f"{settings.FRONTEND_BASE_URL}/payment/result?payment_id={payment.id}")

        # 4) user canceled or gateway says not OK
        if zstatus != "OK":
            payment.mark_failed()
            payment.save(update_fields=["status", "failed_at", "updated_at"])
            return redirect(f"{settings.FRONTEND_BASE_URL}/payment/result?payment_id={payment.id}")

        # 5) verify with zarinpal (amount + authority from DB)
        client = ZarinpalClient()
        v_payload, v_resp = client.verify_payment(amount_rial=payment.amount_rial, authority=authority)

        payment.verify_payload = v_payload
        payment.verify_response = v_resp

        data = (v_resp or {}).get("data") or {}
        code = data.get("code")
        ref_id = data.get("ref_id") or ""

        if code in (100, 101) and ref_id:
            payment.mark_paid(ref_id=str(ref_id))
            payment.save(update_fields=["verify_payload", "verify_response", "status", "ref_id", "paid_at", "updated_at"])

            order = payment.order
            if order.status != Order.Status.PAID:
                order.status = Order.Status.PAID
                order.save(update_fields=["status", "updated_at"])

                fulfillment, _ = Fulfillment.objects.get_or_create(
                    order=order,
                    defaults={"status": Fulfillment.Status.PENDING},
                )

                for oi in order.items.all():
                    FulfillmentItem.objects.get_or_create(
                        fulfillment=fulfillment,
                        order_item=oi,
                        defaults={"status": FulfillmentItem.Status.PENDING},
                    )

                try:
                    send_order_paid_email(order=order, payment=payment)
                except Exception as e:
                    print("send_order_paid_email failed:", e)

                try:
                    send_admin_paid_order_email(order=order, payment=payment)
                except Exception as e:
                    print("send_admin_paid_order_email failed:", e)

            return redirect(f"{settings.FRONTEND_BASE_URL}/payment/result?payment_id={payment.id}")

        # verify failed
        payment.mark_failed()
        payment.save(update_fields=["verify_payload", "verify_response", "status", "failed_at", "updated_at"])
        return redirect(f"{settings.FRONTEND_BASE_URL}/payment/result?payment_id={payment.id}")
