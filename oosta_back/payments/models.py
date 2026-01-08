from django.db import models
from django.utils import timezone

from orders.models import Order


class Payment(models.Model):
    class Provider(models.TextChoices):
        ZARINPAL = "zarinpal", "Zarinpal"

    class Status(models.TextChoices):
        INITIATED = "initiated", "Initiated"
        REDIRECTED = "redirected", "Redirected"
        PAID = "paid", "Paid"
        FAILED = "failed", "Failed"

    order = models.ForeignKey(Order, on_delete=models.PROTECT, related_name="payments")

    provider = models.CharField(
        max_length=20,
        choices=Provider.choices,
        default=Provider.ZARINPAL,
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.INITIATED,
    )

    amount_toman = models.DecimalField(max_digits=12, decimal_places=2)
    amount_rial = models.BigIntegerField()

    authority = models.CharField(max_length=64, blank=True, default="")
    ref_id = models.CharField(max_length=64, blank=True, default="")

    request_payload = models.JSONField(null=True, blank=True)
    request_response = models.JSONField(null=True, blank=True)
    verify_payload = models.JSONField(null=True, blank=True)
    verify_response = models.JSONField(null=True, blank=True)

    initiated_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    failed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=["order", "status"]),
            models.Index(fields=["authority"]),
            models.Index(fields=["ref_id"]),
        ]

    def __str__(self):
        return f"Payment#{self.id} order={self.order_id} {self.provider}/{self.status}"

    @property
    def is_active(self) -> bool:
        return self.status in {self.Status.INITIATED, self.Status.REDIRECTED}

    def mark_paid(self, ref_id: str | None = None):
        self.status = self.Status.PAID
        if ref_id:
            self.ref_id = ref_id
        self.paid_at = timezone.now()

    def mark_failed(self):
        self.status = self.Status.FAILED
        self.failed_at = timezone.now()
