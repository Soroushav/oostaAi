from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import MeView, GuestAuthView, SignupView, LogoutView, PasswordResetConfirmView, PasswordResetRequestView, \
    EmailVerifyConfirmView, EmailVerifyRequestView

urlpatterns = [
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('refresh/', TokenRefreshView.as_view(), name='refresh'),
    path('me/', MeView.as_view(), name='me'),
    path('guest/', GuestAuthView.as_view()),
    path("signup/", SignupView.as_view()),
    path("logout/", LogoutView.as_view()),
    path("password/reset/request/", PasswordResetRequestView.as_view()),
    path("password/reset/confirm/", PasswordResetConfirmView.as_view()),
    path("email/verify/request/", EmailVerifyRequestView.as_view()),
    path("email/verify/confirm/", EmailVerifyConfirmView.as_view()),
]
