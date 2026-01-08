from rest_framework.exceptions import APIException


class EmailNotVerified(APIException):
    status_code = 403
    default_code = "email_not_verified"
    default_detail = "برای ادامه پرداخت، ابتدا ایمیل خود را تأیید کنید."
