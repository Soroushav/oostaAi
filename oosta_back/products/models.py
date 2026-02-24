from django.db import models


class Category(models.Model):
    title = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['title']

    def __str__(self):
        return self.title


class Product(models.Model):
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name="products")
    title = models.CharField(max_length=150)
    slug = models.SlugField(max_length=170)
    description = models.TextField(blank=True)
    stock = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to="products/images/", null=True, blank=True)

    @property
    def starting_price(self):
        min_option = self.options.filter(is_active=True).order_by('price').first()

        if min_option:
            return min_option.price
        return None
    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title


class ProductOption(models.Model):
    class DeliveryMode(models.TextChoices):
        ACTIVATION = "activation", "Activation (personal email)"
        ACCOUNT = "account", "Ready account delivery"

    product = models.ForeignKey(
        "products.Product",
        on_delete=models.CASCADE,
        related_name="options"
    )

    subscription_type = models.CharField(max_length=50, blank=True, default="")

    duration_months = models.PositiveIntegerField()

    delivery_mode = models.CharField(max_length=20, choices=DeliveryMode.choices)

    price = models.DecimalField(max_digits=12, decimal_places=2)

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=["product", "is_active"]),
        ]
        unique_together = ("product", "subscription_type", "duration_months", "delivery_mode")

    def __str__(self):
        st = self.subscription_type or "none"
        return f"{self.product_id} | {st} | {self.duration_months}m | {self.delivery_mode}"
