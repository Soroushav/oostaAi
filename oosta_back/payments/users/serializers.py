from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class ProfileSerializer(serializers.ModelSerializer):
    is_email_verified = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "phone_number",
            "is_guest",
            "is_email_verified",
        ]
        read_only_fields = ["id", "email", "is_guest", "is_email_verified"]

    def get_is_email_verified(self, obj):
        return bool(getattr(obj, "email_verified_at", None))


class SignupSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True, min_length=8)

    def validate(self, attrs):
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError({
                "password2": "Passwords do not match."
            })
        return attrs

    def create(self, validated_data):
        email = User.objects.normalize_email(validated_data["email"])
        password = validated_data["password"]

        user = User.objects.filter(email=email).first()

        if user:
            if user.is_guest:
                user.is_guest = False
                user.set_password(password)
                user.is_active = True
                user.save(update_fields=["is_guest", "password", "is_active"])
                return user

            raise serializers.ValidationError({
                "email": "This email is already registered. Please login."
            })

        # 👤 user جدید
        return User.objects.create_user(
            email=email,
            password=password,
            is_active=True,
        )


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()


class PasswordResetConfirmSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField(max_length=6)
    new_password = serializers.CharField(min_length=8, write_only=True)
    new_password2 = serializers.CharField(min_length=8, write_only=True)

    def validate(self, attrs):
        if attrs["new_password"] != attrs["new_password2"]:
            raise serializers.ValidationError({"new_password2": "Passwords do not match."})
        return attrs


class EmailVerifyRequestSerializer(serializers.Serializer):
    pass


class EmailVerifyConfirmSerializer(serializers.Serializer):
    code = serializers.CharField(max_length=6)

    def validate_code(self, value: str):
        value = value.strip()
        if not value.isdigit() or len(value) != 6:
            raise serializers.ValidationError("Invalid code format.")
        return value
