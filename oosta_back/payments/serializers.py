from rest_framework import serializers


class ZarinpalRequestSerializer(serializers.Serializer):
    order_id = serializers.IntegerField()


class PaymentStatusSerializer(serializers.Serializer):
    payment_id = serializers.IntegerField()
    order_id = serializers.IntegerField()
    status = serializers.CharField()
    amount_toman = serializers.CharField()
    ref_id = serializers.CharField(allow_blank=True, required=False)
