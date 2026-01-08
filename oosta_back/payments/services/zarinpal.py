import requests
from django.conf import settings


class ZarinpalClient:
    def __init__(self):
        self.merchant_id = settings.ZARINPAL_MERCHANT_ID
        self.mode = getattr(settings, "ZARINPAL_MODE", "sandbox")

        if self.mode == "sandbox":
            self.request_url = "https://sandbox.zarinpal.com/pg/v4/payment/request.json"
            self.verify_url = "https://sandbox.zarinpal.com/pg/v4/payment/verify.json"
            self.startpay_base = "https://sandbox.zarinpal.com/pg/StartPay/"
        else:
            self.request_url = "https://api.zarinpal.com/pg/v4/payment/request.json"
            self.verify_url = "https://api.zarinpal.com/pg/v4/payment/verify.json"
            self.startpay_base = "https://www.zarinpal.com/pg/StartPay/"

    def request_payment(self, *, amount_rial: int, callback_url: str, description: str, metadata: dict | None = None):
        payload = {
            "merchant_id": self.merchant_id,
            "amount": amount_rial,
            "callback_url": callback_url,
            "description": description,
        }
        if metadata:
            payload["metadata"] = metadata

        resp = requests.post(self.request_url, json=payload, timeout=15)
        resp.raise_for_status()
        return payload, resp.json()

    def verify_payment(self, *, amount_rial: int, authority: str):
        payload = {
            "merchant_id": self.merchant_id,
            "amount": amount_rial,
            "authority": authority,
        }
        resp = requests.post(self.verify_url, json=payload, timeout=15)
        resp.raise_for_status()
        return payload, resp.json()

    def startpay_url(self, authority: str) -> str:
        return f"{self.startpay_base}{authority}"
