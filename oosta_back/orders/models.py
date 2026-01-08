from django.conf import settings
from django.db import models
from products.models import Product, ProductOption


class Order(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        PAID = "paid", "Paid"
        DELIVERED = "delivered", "Delivered"
        CANCELED = "canceled", "Canceled"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="orders")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    option = models.ForeignKey(
        ProductOption,
        on_delete=models.PROTECT,
        related_name="order_items",
        null=True,
        blank=True,
    )

    quantity = models.PositiveIntegerField(default=1)
    target_email_snapshot = models.EmailField(blank=True, null=True)
    unit_price_snapshot = models.DecimalField(max_digits=12, decimal_places=2)

    def line_total(self):
        return self.unit_price_snapshot * self.quantity
