from django.db import models
from django.db.models import Q


class Fulfillment(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        PARTIAL = "partial", "Partial"
        DELIVERED = "delivered", "Delivered"

    class DeliveryEmailStatus(models.TextChoices):
        PENDING = "pending", "Pending"
        SENT = "sent", "Sent"
        FAILED = "failed", "Failed"

    order = models.OneToOneField(
        "orders.Order",
        on_delete=models.CASCADE,
        related_name="fulfillment",
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )

    delivery_email_status = models.CharField(
        max_length=20,
        choices=DeliveryEmailStatus.choices,
        default=DeliveryEmailStatus.PENDING,
    )
    delivery_email_tries = models.PositiveIntegerField(default=0)
    delivery_email_last_error = models.TextField(blank=True, null=True)
    delivery_email_sent_at = models.DateTimeField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def is_ready_for_delivery_email(self):
        items = self.items.all()

        if not items.exists():
            return False

        # اگر pending داریم
        if items.filter(status=FulfillmentItem.Status.PENDING).exists():
            return False

        # failed بدون report
        if items.filter(
                status=FulfillmentItem.Status.FAILED
        ).filter(
            Q(report__isnull=True) | Q(report="")
        ).exists():
            return False

        # قبلاً ایمیل ارسال شده
        if self.delivery_email_status == self.DeliveryEmailStatus.SENT:
            return False

        return True


class FulfillmentItem(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        SUCCESS = "success", "Success"
        FAILED = "failed", "Failed"

    fulfillment = models.ForeignKey(
        Fulfillment,
        on_delete=models.CASCADE,
        related_name="items",
    )

    order_item = models.ForeignKey(
        "orders.OrderItem",
        on_delete=models.CASCADE,
        related_name="fulfillment_items",
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )

    # ✅ فقط payload/report می‌مونه
    payload = models.JSONField(blank=True, null=True)
    report = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["fulfillment", "order_item"],
                name="uniq_fulfillment_order_item",
            )
        ]
        indexes = [
            models.Index(fields=["status"]),
            models.Index(fields=["order_item"]),
        ]

    def initialize_account_payload(self):
        if self.order_item and self.order_item.is_account and not self.payload:
            self.payload = {
                "accounts": [{"email": "", "password": ""} for _ in range(self.order_item.quantity)]
            }

    def save(self, *args, **kwargs):
        if self.order_item:
            if self.order_item.is_activation:
                self.payload = None
            elif self.order_item.is_account:
                self.initialize_account_payload()

        super().save(*args, **kwargs)

    def __str__(self):
        return f"Item | Order#{self.fulfillment.order_id} | OrderItem#{self.order_item_id} | {self.status}"
