from __future__ import annotations

from dataclasses import dataclass
from typing import Optional, Tuple
from django.template.loader import render_to_string
from django.conf import settings
from django.core.mail import send_mail, EmailMultiAlternatives
from django.db import transaction
from django.utils import timezone

from .models import Fulfillment, FulfillmentItem


@dataclass
class DeliveryEmailResult:
    subject: str
    body: str
    recipient: str


def _order_recipient_email(order) -> str:
    # رایج‌ترین حالت: order.user.email
    user = getattr(order, "user", None)
    if user and getattr(user, "email", None):
        return user.email

    # fallback احتمالی: order.email
    if getattr(order, "email", None):
        return order.email

    raise ValueError("Order has no recipient email (order.user.email / order.email).")


def _product_name_from_order_item(order_item) -> str:
    """
    تلاش می‌کنه اسم محصول/آیتم رو از snapshot یا فیلدهای رایج دربیاره.
    اینجا intentionally defensiv نوشتیم چون اسم دقیق فیلدها ممکنه فرق کنه.
    """
    # چیزی که خودت نوشتی:
    val = getattr(order_item, "product_snapshot_name", None)
    if val:
        return str(val)

    # چند fallback رایج:
    val = getattr(order_item, "title_snapshot", None)
    if val:
        return str(val)

    product = getattr(order_item, "product", None)
    if product and getattr(product, "name", None):
        return str(product.name)

    return f"OrderItem#{getattr(order_item, 'id', '?')}"


def _format_accounts(payload: dict) -> str:
    accounts = (payload or {}).get("accounts") or []
    lines = []
    for i, acc in enumerate(accounts, start=1):
        email = (acc or {}).get("email", "")
        password = (acc or {}).get("password", "")
        lines.append(f"{i}) Email: {email}\n   Password: {password}")
    return "\n".join(lines).strip()


def build_delivery_email(fulfillment: Fulfillment) -> DeliveryEmailResult:
    order = fulfillment.order
    recipient = _order_recipient_email(order)

    subject = f"Order #{getattr(order, 'id', '')} - Delivery Result".strip()

    # بهتره prefetch شده باشه، ولی اینجا هم کار می‌کنه
    items = list(fulfillment.items.select_related("order_item").all())

    success_blocks = []
    failed_blocks = []

    for item in items:
        oi = item.order_item
        name = _product_name_from_order_item(oi)

        if item.status == FulfillmentItem.Status.SUCCESS:
            if getattr(oi, "is_account", False):
                accounts_text = _format_accounts(item.payload or {})
                if accounts_text:
                    success_blocks.append(f"✅ {name}\n{accounts_text}")
                else:
                    success_blocks.append(f"✅ {name}\n(Accounts provided)")
            else:
                # activation یا هر چیز غیر-account
                success_blocks.append(f"✅ {name}\nDelivered / Activated")

        elif item.status == FulfillmentItem.Status.FAILED:
            report = item.report or "(no report)"
            failed_blocks.append(f"❌ {name}\nReason: {report}")

    body_parts = []
    body_parts.append("Your order delivery has been processed.\n")

    if success_blocks:
        body_parts.append("Successful items:\n")
        body_parts.append("\n\n".join(success_blocks))
        body_parts.append("")

    if failed_blocks:
        body_parts.append("Failed items:\n")
        body_parts.append("\n\n".join(failed_blocks))
        body_parts.append("")

    body_parts.append("Thank you.")
    body = "\n".join(body_parts).strip() + "\n"

    return DeliveryEmailResult(subject=subject, body=body, recipient=recipient)


def all_items_success(fulfillment: Fulfillment) -> bool:
    qs = fulfillment.items.all()
    return qs.exists() and not qs.exclude(status=FulfillmentItem.Status.SUCCESS).exists()


def mark_order_delivered_if_possible(fulfillment: Fulfillment) -> bool:
    """
    فقط وقتی همه آیتم‌ها success باشند.
    (اینکه شرطت success یا failed+report برای ارسال ایمیل بود، جداست؛
     delivered شدن Order رو منطقیه فقط وقتی همه success باشند.)
    """
    if not all_items_success(fulfillment):
        return False

    order = fulfillment.order

    # اگر enum/status دقیق پروژه فرق داشت، اینجا رو باید با مدل Order خودتون sync کنیم.
    # فرض: order.status string و مقدار "delivered"
    if getattr(order, "status", None) == "delivered":
        return True

    setattr(order, "status", "delivered")
    if hasattr(order, "delivered_at"):
        order.delivered_at = timezone.now()

    order.save(update_fields=[f for f in ["status", "delivered_at", "updated_at"] if hasattr(order, f)])
    return True


def send_delivery_email(fulfillment, *, also_mark_delivered=True):
    order = fulfillment.order

    # data آماده برای template
    items = list(fulfillment.items.select_related("order_item").all())
    success_items = []
    failed_items = []

    for it in items:
        oi = it.order_item
        title = get_order_item_title(oi)

        if it.status == it.Status.SUCCESS:
            payload = it.payload or {}
            accounts = payload.get("accounts") or []
            success_items.append({
                "title": title,
                "delivery_mode": "account" if getattr(oi, "is_account", False) else "activation",
                "target_email": getattr(oi, "target_email", None),
                "accounts": accounts,
            })
        elif it.status == it.Status.FAILED:
            failed_items.append({
                "title": title,
                "report": it.report or "(بدون گزارش)",
            })

    overall_status_text = "تحویل کامل" if not failed_items else "تحویل ناقص"

    ctx = {
        "order_number": order.id,
        "delivered_at": timezone.now().strftime("%Y-%m-%d %H:%M"),
        "overall_status_text": overall_status_text,
        "success_items": success_items,
        "failed_items": failed_items,
        "brand_name": getattr(settings, "BRAND_NAME", "OostaAI"),
        "support_text": getattr(settings, "SUPPORT_TEXT", ""),
    }

    subject = f"نتیجه تحویل سفارش #{order.id}"
    to_email = order.user.email

    html_body = render_to_string("emails/order_delivered.html", ctx)
    text_body = f"{subject}\n\nوضعیت: {overall_status_text}\n"

    msg = EmailMultiAlternatives(
        subject=subject,
        body=text_body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[to_email],
    )
    msg.attach_alternative(html_body, "text/html")
    msg.send(fail_silently=False)

    # (اختیاری) delivered کردن order رو هم اگر قبلاً گذاشتی همونجا نگه دار


def get_order_item_title(oi):
    # 1) اگر snapshot اسم محصول داری
    for attr in [
        "title",  # بعضی پروژه‌ها
        "name_snapshot",
        "product_snapshot_name",
        "option_snapshot_name",
        "option_snapshot_title",
        "product_snapshot_title",
    ]:
        v = getattr(oi, attr, None)
        if v:
            return str(v)

    # 2) بهترین fallback: همون چیزی که تو admin نشون می‌ده (معمولاً شامل نام محصول/پلن/مدت)
    s = str(oi).strip()
    if s and "OrderItem" not in s:
        return s

    # 3) fallback‌های نهایی
    opt = getattr(oi, "option", None)
    if opt and getattr(opt, "name", None):
        return str(opt.name)

    prod = getattr(oi, "product", None)
    if prod and getattr(prod, "name", None):
        return str(prod.name)

    return "آیتم سفارش"
