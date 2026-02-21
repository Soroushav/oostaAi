from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils import timezone


def _get_order_recipient_email(order):
    """
    Recipient email priority:
    1) order.user.email
    2) order.email / order.customer_email / order.target_email (if exists in your project)
    """
    user = getattr(order, "user", None)
    if user and getattr(user, "email", None):
        return user.email

    for attr in ("email", "customer_email", "target_email"):
        val = getattr(order, attr, None)
        if val:
            return val

    return None


def _get_product_title_from_order_item(oi) -> str:
    """
    OrderItem -> option (ProductOption) -> product -> title
    """
    option = getattr(oi, "option", None)
    if not option:
        return ""
    product = getattr(option, "product", None)
    if not product:
        return ""
    return getattr(product, "title", "") or ""


def _get_option_title_from_order_item(oi) -> str:
    option = getattr(oi, "option", None)
    if not option:
        return ""
    return getattr(option, "title", "") or ""


def _humanize_option_title(option_title: str) -> str:
    """
    Converts internal option titles like:
      'private | 1m | account | 1'
    into more readable Persian-ish:
      'پرایوت - ۱ ماهه - اکانت - 1'
    """
    if not option_title:
        return ""

    s = option_title.strip()
    s = s.replace("|", " | ")
    while "  " in s:
        s = s.replace("  ", " ")

    mappings = {
        "private": "پرایوت",
        "shared": "اشتراکی",
        "account": "اکانت",
        "activation": "فعال‌سازی",
        "1m": "۱ ماهه",
        "3m": "۳ ماهه",
        "6m": "۶ ماهه",
        "12m": "۱۲ ماهه",
        "1y": "۱ ساله",
    }

    parts = [p.strip() for p in s.split("|") if p.strip()]
    out = []
    for p in parts:
        key = p.lower()
        out.append(mappings.get(key, p))
    return " - ".join(out)


def send_order_paid_email(*, order, payment) -> int:
    """
    Sends transaction email after order becomes PAID (after successful verify).
    Uses templates:
      - templates/emails/order_paid.txt
      - templates/emails/order_paid.html
    """
    to_email = _get_order_recipient_email(order)
    if not to_email:
        return 0  # no recipient -> safely do nothing

    items = []
    for oi in order.items.all():
        product_title = _get_product_title_from_order_item(oi)

        raw_option_title = _get_option_title_from_order_item(oi)
        option_title = _humanize_option_title(raw_option_title)

        quantity = getattr(oi, "quantity", 1)

        # fields in your OrderItem
        unit_price = getattr(oi, "unit_price_snapshot", None)

        # method in your OrderItem
        if hasattr(oi, "line_total") and callable(getattr(oi, "line_total")):
            total_price = oi.line_total()
        else:
            total_price = (unit_price or 0) * quantity

        target_email = getattr(oi, "target_email_snapshot", None)

        items.append(
            {
                "title": product_title,
                "option_title": option_title,
                "quantity": quantity,
                "unit_price": unit_price,
                "total_price": total_price,
                "target_email": target_email,
            }
        )

    order_number = getattr(order, "number", None) or getattr(order, "id", None)
    paid_at = getattr(payment, "paid_at", None) or timezone.now()

    paid_amount = (
        getattr(payment, "amount_rial", None)
        or getattr(payment, "amount", None)
        or ""
    )

    context = {
        "order_number": order_number,
        "paid_at": paid_at,
        "paid_amount": paid_amount,
        "currency": "ریال",
        "items": items,
        "brand_name": getattr(settings, "BRAND_NAME", "OostaAI Store"),
        "support_text": getattr(settings, "SUPPORT_TEXT", ""),
    }

    subject = f"تأیید پرداخت سفارش شماره {order_number}"

    text_body = render_to_string("emails/order_paid.txt", context)
    html_body = render_to_string("emails/order_paid.html", context)

    msg = EmailMultiAlternatives(
        subject=subject,
        body=text_body,
        from_email=getattr(settings, "DEFAULT_FROM_EMAIL", None),
        to=[to_email],
    )
    msg.attach_alternative(html_body, "text/html")
    return msg.send(fail_silently=False)