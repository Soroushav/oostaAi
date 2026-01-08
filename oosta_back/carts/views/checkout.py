from django.db import transaction
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from carts.models import Cart
from carts.services import get_or_create_cart
from orders.models import Order, OrderItem


class CartCheckoutView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        cart, _ = get_or_create_cart(request)

        # فقط cart فعال اجازه checkout داره
        if cart.status != Cart.Status.ACTIVE:
            return Response(
                {"detail": "Cart is not active."},
                status=status.HTTP_400_BAD_REQUEST
            )

        items = cart.items.select_related("option", "option__product").all()
        if not items.exists():
            return Response(
                {"detail": "Cart is empty."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # اگر cart مهمان بوده و الان user لاگین کرده → attach
        if cart.user_id is None:
            cart.user = request.user
            cart.save(update_fields=["user"])

        # validate همه آیتم‌ها قبل از ساخت order
        for ci in items:
            if ci.option_id is None:
                return Response(
                    {"detail": "Cart item has no option."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if not ci.option.is_active:
                return Response(
                    {"detail": f"Option {ci.option_id} is not active."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if hasattr(ci.option, "product") and not ci.option.product.is_active:
                return Response(
                    {"detail": f"Product of option {ci.option_id} is not active."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if ci.quantity <= 0:
                return Response(
                    {"detail": "Quantity must be greater than 0."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # ✅ قانون شما: activation بدون target_email حق checkout ندارد
            if ci.option.delivery_mode == "activation" and not ci.target_email:
                return Response(
                    {
                        "detail": (
                            f"Activation item '{ci.option.product.title}' requires target_email. "
                            "Please enter target email or remove this item from cart."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

        # ساخت order بعد از validate
        order = Order.objects.create(
            user=request.user,
            status=Order.Status.PENDING
        )

        # ساخت order items با snapshot قیمت + snapshot target_email
        for ci in items:
            OrderItem.objects.create(
                order=order,
                option=ci.option,
                quantity=ci.quantity,
                unit_price_snapshot=ci.option.price,
                target_email_snapshot=ci.target_email,  # ✅ snapshot
            )

        # بستن cart
        cart.status = Cart.Status.CHECKED_OUT
        cart.save(update_fields=["status"])

        return Response(
            {"order_id": order.id, "status": order.status},
            status=status.HTTP_201_CREATED
        )
