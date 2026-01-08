from django.urls import path
from carts.views.views import CartGetView, CartItemAddView, CartItemUpdateDeleteView
from carts.views.checkout import CartCheckoutView

urlpatterns = [
    path("cart/", CartGetView.as_view()),
    path("cart/items/", CartItemAddView.as_view()),
    path("cart/items/<int:id>/", CartItemUpdateDeleteView.as_view()),
    path("cart/checkout/", CartCheckoutView.as_view(), name="cart-checkout"),
]
