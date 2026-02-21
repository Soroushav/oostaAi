from django.db import models


class FulfillmentAttempt(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        SUCCESS = "success", "Success"
        FAILED = "failed", "Failed"

    order_item = models.ForeignKey(
        "orders.OrderItem",
        on_delete=models.CASCADE,
        related_name="fulfillment_attempts",
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )

    tries = models.PositiveIntegerField(default=0)
    last_error = models.TextField(blank=True, null=True)

    payload = models.JSONField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=["status"]),
            models.Index(fields=["order_item"]),
        ]

    def __str__(self):
        return f"Attempt#{self.pk} - item={self.order_item_id} - {self.status}"