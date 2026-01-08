from django.urls import path

from payments.views import PaymentEntryView
from payments.views_zarinpal import ZarinpalRequestView
from payments.views_callback import ZarinpalCallbackView
from payments.views_status import PaymentStatusView

urlpatterns = [
    path("entry/", PaymentEntryView.as_view(), name="payment-entry"),

    path("zarinpal/request/", ZarinpalRequestView.as_view(), name="zarinpal-request"),
    path("zarinpal/callback/", ZarinpalCallbackView.as_view(), name="zarinpal-callback"),

    path("<int:id>/status/", PaymentStatusView.as_view(), name="payment-status"),
]
