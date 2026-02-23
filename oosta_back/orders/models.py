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

    def __str__(self):
        email = getattr(self.user, "email", "") if self.user_id else ""
        return f"Order#{self.id} ({self.status}) {email}"


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

    @property
    def is_activation(self):
        if not self.option_id:
            return False
        title = str(self.option).lower()
        return "activation" in title

    @property
    def is_account(self):
        if not self.option_id:
            return False
        title = str(self.option).lower()
        return "account" in title

    def line_total(self):
        return self.unit_price_snapshot * self.quantity

    def __str__(self):
        product_title = ""
        option_title = ""

        if hasattr(self, "option") and self.option_id:
            option_title = getattr(self.option, "title", "") or str(self.option)
            product = getattr(self.option, "product", None)
            if product is not None:
                product_title = getattr(product, "title", "") or str(product)

        if not product_title and hasattr(self, "product_option") and self.product_option_id:
            option_title = getattr(self.product_option, "title", "") or str(self.product_option)
            product = getattr(self.product_option, "product", None)
            if product is not None:
                product_title = getattr(product, "title", "") or str(product)

        title = product_title or option_title or f"OrderItem#{self.id}"
        target = self.target_email_snapshot or "-"

        return f"Order#{self.order_id} | {title} | {option_title} × {self.quantity} | target: {target}"
