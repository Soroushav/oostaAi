from carts.models import Cart

CART_TOKEN_HEADER = "HTTP_X_CART_TOKEN"


def get_or_create_cart(request):
    token = request.META.get(CART_TOKEN_HEADER)

    if token:
        try:
            cart = Cart.objects.get(token=token, status=Cart.Status.ACTIVE)
            return cart, False
        except Cart.DoesNotExist:
            pass

    cart = Cart.objects.create()
    return cart, True
