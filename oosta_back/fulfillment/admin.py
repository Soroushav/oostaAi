# fulfillment/admin.py

import logging
from threading import Thread

from django.contrib import admin
from django.db import transaction
from django.utils import timezone

from .models import Fulfillment, FulfillmentItem
from .services import send_delivery_email

logger = logging.getLogger(__name__)


class FulfillmentItemInline(admin.TabularInline):
    model = FulfillmentItem
    extra = 0


@admin.register(Fulfillment)
class FulfillmentAdmin(admin.ModelAdmin):
    inlines = [FulfillmentItemInline]
    list_display = ("id", "order", "status", "delivery_email_status", "delivery_email_tries", "updated_at")
    list_select_related = ("order",)

    def _run_async(self, fn):
        t = Thread(target=fn, daemon=True)
        t.start()

    def save_related(self, request, form, formsets, change):
        super().save_related(request, form, formsets, change)

        fulfillment_id = form.instance.id

        def after_commit():
            logger.warning("FULFILLMENT after_commit fired: %s", fulfillment_id)

            fulfillment = (
                Fulfillment.objects
                .select_related("order")
                .prefetch_related("items__order_item")
                .get(id=fulfillment_id)
            )

            ready = fulfillment.is_ready_for_delivery_email()
            logger.warning(
                "FULFILLMENT ready=%s id=%s email_status=%s items=%s",
                ready,
                fulfillment.id,
                fulfillment.delivery_email_status,
                list(fulfillment.items.values_list("status", "report")),
            )

            if not ready:
                return

            try:
                send_delivery_email(fulfillment)

                fulfillment.delivery_email_status = Fulfillment.DeliveryEmailStatus.SENT
                fulfillment.delivery_email_sent_at = timezone.now()
                fulfillment.delivery_email_last_error = ""

                items = fulfillment.items.all()

                if items.exists() and not items.exclude(
                        status=FulfillmentItem.Status.SUCCESS
                ).exists():
                    fulfillment.status = Fulfillment.Status.DELIVERED
                else:
                    fulfillment.status = Fulfillment.Status.PARTIAL

                fulfillment.save(update_fields=[
                    "status",
                    "delivery_email_status",
                    "delivery_email_sent_at",
                    "delivery_email_last_error",
                    "updated_at",
                ])

                logger.warning("FULFILLMENT email sent ok: %s", fulfillment_id)

            except Exception as e:
                fulfillment.delivery_email_status = Fulfillment.DeliveryEmailStatus.FAILED
                fulfillment.delivery_email_tries = (fulfillment.delivery_email_tries or 0) + 1
                fulfillment.delivery_email_last_error = str(e)
                fulfillment.save(update_fields=[
                    "delivery_email_status",
                    "delivery_email_tries",
                    "delivery_email_last_error",
                    "updated_at",
                ])

                logger.exception("FULFILLMENT email send failed: %s", fulfillment_id)

        transaction.on_commit(lambda: self._run_async(after_commit))