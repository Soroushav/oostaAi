from rest_framework.throttling import AnonRateThrottle, UserRateThrottle


class AuthOtpRateThrottle(AnonRateThrottle):
    scope = 'auth_otp'


class LoginRateThrottle(AnonRateThrottle):
    scope = 'login'


class UserActionRateThrottle(UserRateThrottle):
    scope = 'user_action'
