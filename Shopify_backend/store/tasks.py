import smtplib

from celery import shared_task
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode

from store.models import User


@shared_task(
    bind=True,
    name="store.send_password_reset_email",
    autoretry_for=(smtplib.SMTPException, OSError),
    retry_backoff=True,
    retry_jitter=True,
    retry_kwargs={"max_retries": 3},
)
def send_password_reset_email(self, email: str) -> str:
    user = User.objects.filter(email__iexact=email).first()
    if not user:
        return "noop:user-not-found"

    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    reset_url = f"{settings.FRONTEND_URL.rstrip('/')}/reset-password/{uid}/{token}"

    try:
        send_mail(
            subject="Reset your password",
            message=f"Use this link to reset your password: {reset_url}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )
        return "sent"
    except (smtplib.SMTPException, OSError) as exc:
        print(
            "Password reset email failed",
            f"backend={settings.EMAIL_BACKEND}",
            f"host={settings.EMAIL_HOST}",
            f"port={settings.EMAIL_PORT}",
            f"tls={settings.EMAIL_USE_TLS}",
            f"ssl={settings.EMAIL_USE_SSL}",
            f"error={exc}",
        )
        if settings.DEBUG:
            print(f"Reset link fallback for debugging: {reset_url}")
        raise
