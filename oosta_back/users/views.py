from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import SignupSerializer, ProfileSerializer, PasswordResetConfirmSerializer, \
    PasswordResetRequestSerializer, EmailVerifyRequestSerializer, EmailVerifyConfirmSerializer
from django.core.mail import send_mail
from django.utils import timezone
from .models import OneTimeCode

User = get_user_model()


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(ProfileSerializer(request.user).data)

    def patch(self, request):
        serializer = ProfileSerializer(
            request.user,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


class SignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()

        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "created": True,
            },
            status=status.HTTP_201_CREATED
        )


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh = request.data.get("refresh")
        if not refresh:
            return Response(
                {"detail": "refresh token is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            token = RefreshToken(refresh)
            token.blacklist()
        except Exception:
            return Response(
                {"detail": "Invalid refresh token"},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            {"detail": "Logged out successfully"},
            status=status.HTTP_200_OK
        )


class GuestAuthView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response(
                {"detail": "Email is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        email = User.objects.normalize_email(email)

        user, created = User.objects.get_or_create(
            email=email,
            defaults={"is_guest": True, "is_active": True},
        )

        if created:
            user.set_unusable_password()
            user.save()
        elif not getattr(user, "is_guest", False):
            return Response(
                {"detail": "This email is already registered. Please login."},
                status=status.HTTP_409_CONFLICT
            )

        refresh = RefreshToken.for_user(user)

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "guest": True,
        })


class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        ser = PasswordResetRequestSerializer(data=request.data)
        ser.is_valid(raise_exception=True)

        email = User.objects.normalize_email(ser.validated_data["email"])

        user = User.objects.filter(email=email, is_guest=False).first()

        if not user:
            return Response(
                {"detail": "If the email exists, a code was sent."},
                status=status.HTTP_200_OK,
            )

        otp = OneTimeCode.create_otp(
            user=user,
            purpose=OneTimeCode.Purpose.PASSWORD_RESET,
            ttl_minutes=10,
        )

        send_mail(
            subject="Password reset code",
            message=f"Your password reset code is: {otp.code}",
            from_email=None,
            recipient_list=[user.email],
            fail_silently=False,
        )

        return Response(
            {"detail": "If the email exists, a code was sent."},
            status=status.HTTP_200_OK,
        )


class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        ser = PasswordResetConfirmSerializer(data=request.data)
        ser.is_valid(raise_exception=True)

        email = User.objects.normalize_email(ser.validated_data["email"])
        code = ser.validated_data["code"]
        new_password = ser.validated_data["new_password"]

        user = User.objects.filter(email=email, is_guest=False).first()
        if not user:
            return Response({"detail": "Invalid or expired code"}, status=status.HTTP_400_BAD_REQUEST)

        otp = OneTimeCode.objects.filter(
            user=user,
            purpose=OneTimeCode.Purpose.PASSWORD_RESET,
            code=code,
            used_at__isnull=True,
        ).order_by("-created_at").first()

        if not otp or not otp.is_valid():
            return Response({"detail": "Invalid or expired code"}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save(update_fields=["password"])

        otp.used_at = timezone.now()
        otp.save(update_fields=["used_at"])

        return Response({"detail": "Password changed successfully"}, status=status.HTTP_200_OK)


class EmailVerifyRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        EmailVerifyRequestSerializer(data=request.data).is_valid(raise_exception=True)

        user = request.user

        if getattr(user, "is_email_verified", False):
            # اگر is_email_verified method هست:
            if callable(user.is_email_verified) and user.is_email_verified():
                return Response({"detail": "Email already verified."}, status=status.HTTP_200_OK)
            if user.is_email_verified is True:
                return Response({"detail": "Email already verified."}, status=status.HTTP_200_OK)

        OneTimeCode.objects.filter(
            user=user,
            purpose=OneTimeCode.Purpose.EMAIL_VERIFY,
            used_at__isnull=True,
            expires_at__gt=timezone.now(),
        ).update(expires_at=timezone.now())

        otc = OneTimeCode.create_otp(
            user=user,
            purpose=OneTimeCode.Purpose.EMAIL_VERIFY,
            ttl_minutes=10,
        )

        send_mail(
            subject="Email verification code",
            message=f"Your verification code is: {otc.code}",
            from_email=None,
            recipient_list=[user.email],
            fail_silently=False,  # برای دیباگ
        )

        return Response({"detail": "Verification code sent."}, status=status.HTTP_200_OK)


class EmailVerifyConfirmView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        ser = EmailVerifyConfirmSerializer(data=request.data)
        ser.is_valid(raise_exception=True)

        user = request.user
        code = ser.validated_data["code"]

        otc = OneTimeCode.objects.filter(
            user=user,
            purpose=OneTimeCode.Purpose.EMAIL_VERIFY,
            code=code,
            used_at__isnull=True,
            expires_at__gt=timezone.now(),
        ).order_by("-created_at").first()

        if not otc:
            return Response({"detail": "Invalid or expired code."}, status=status.HTTP_400_BAD_REQUEST)

        otc.used_at = timezone.now()
        otc.save(update_fields=["used_at"])

        if hasattr(user, "email_verified_at"):
            user.email_verified_at = timezone.now()
            user.save(update_fields=["email_verified_at"])
        else:
            if hasattr(user, "email_verified"):
                user.email_verified = True
                user.save(update_fields=["email_verified"])

        return Response({"detail": "Email verified successfully."}, status=status.HTTP_200_OK)
