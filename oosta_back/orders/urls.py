from django.urls import path
from orders.views.admin import AdminOrderListView, AdminOrderStatusUpdateView
from orders.views.public import OrderListView, OrderDetailView, OrderCancelView

urlpatterns = [
    # user
    path("orders/", OrderListView.as_view()),
    path("orders/<int:id>/", OrderDetailView.as_view(), name="order-detail"),
    path("orders/<int:id>/cancel/", OrderCancelView.as_view(), name="order-cancel"),

    # admin
    path("admin/orders/", AdminOrderListView.as_view(), name="admin-orders-list"),
    path("admin/orders/<int:id>/status/", AdminOrderStatusUpdateView.as_view(), name="admin-orders-status-update"),
]
