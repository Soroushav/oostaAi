from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
import random
from datetime import timedelta
from django.utils import timezone


class UserManager(BaseUserManager):
    use_in_migrations = True

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email must be set")
        email = self.normalize_email(email)
        extra_fields.setdefault("is_active", True)
        user = self.model(email=email, **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    username = None

    email = models.EmailField(unique=True)
    is_guest = models.BooleanField(default=False)

    email_verified_at = models.DateTimeField(null=True, blank=True)

    phone_number = models.CharField(max_length=30, blank=True, default="")

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()

    @property
    def is_email_verified(self) -> bool:
        return self.email_verified_at is not None

    def __str__(self):
        return self.email


class OneTimeCode(models.Model):
    class Purpose(models.TextChoices):
        PASSWORD_RESET = "password_reset", "Password Reset"
        EMAIL_VERIFY = "email_verify", "Email Verify"

    user = models.ForeignKey(
        "users.User",
        on_delete=models.CASCADE,
        related_name="one_time_codes",
    )
    purpose = models.CharField(max_length=30, choices=Purpose.choices)
    code = models.CharField(max_length=6)
    expires_at = models.DateTimeField()
    used_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["user", "purpose", "code"]),
            models.Index(fields=["expires_at"]),
        ]

    @staticmethod
    def generate_code() -> str:
        return f"{random.randint(0, 999999):06d}"

    @classmethod
    def create_otp(cls, user, purpose, ttl_minutes: int = 10):
        return cls.objects.create(
            user=user,
            purpose=purpose,
            code=cls.generate_code(),
            expires_at=timezone.now() + timedelta(minutes=ttl_minutes),
        )

    def is_valid(self) -> bool:
        return self.used_at is None and timezone.now() <= self.expires_at
