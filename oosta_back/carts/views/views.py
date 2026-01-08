from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from carts.models import CartItem, Cart
from carts.serializers.cart import CartReadSerializer
from carts.serializers.items import CartItemCreateSerializer, CartItemUpdateSerializer
from carts.services import get_or_create_cart


class CartGetView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = CartReadSerializer

    def get(self, request):
        cart, created = get_or_create_cart(request)
        data = self.get_serializer(cart).data

        resp = Response(data)
        resp["X-Cart-Token"] = str(cart.token)
        return resp


class CartItemAddView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = CartItemCreateSerializer

    def post(self, request):
        cart, _ = get_or_create_cart(request)

        # فقط cart فعال اجازه افزودن دارد
        if cart.status != Cart.Status.ACTIVE:
            return Response(
                {"detail": "Cart is not active."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = self.get_serializer(data=request.data, context={"cart": cart})
        serializer.is_valid(raise_exception=True)
        serializer.save()

        resp = Response(CartReadSerializer(cart).data, status=status.HTTP_201_CREATED)
        resp["X-Cart-Token"] = str(cart.token)
        return resp


class CartItemUpdateDeleteView(generics.GenericAPIView):
    permission_classes = [AllowAny]

    def patch(self, request, id: int):
        cart, _ = get_or_create_cart(request)

        # فقط cart فعال اجازه تغییر دارد
        if cart.status != Cart.Status.ACTIVE:
            return Response(
                {"detail": "Cart is not active."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            item = cart.items.select_related("option", "option__product").get(id=id)
        except CartItem.DoesNotExist:
            return Response({"detail": "Not found."}, status=404)

        serializer = CartItemUpdateSerializer(instance=item, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        resp = Response(CartReadSerializer(cart).data, status=200)
        resp["X-Cart-Token"] = str(cart.token)
        return resp

    def delete(self, request, id: int):
        cart, _ = get_or_create_cart(request)

        # فقط cart فعال اجازه حذف دارد
        if cart.status != Cart.Status.ACTIVE:
            return Response(
                {"detail": "Cart is not active."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            item = cart.items.get(id=id)
        except CartItem.DoesNotExist:
            return Response({"detail": "Not found."}, status=404)

        item.delete()
        resp = Response(CartReadSerializer(cart).data, status=200)
        resp["X-Cart-Token"] = str(cart.token)
        return resp
