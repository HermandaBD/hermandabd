# tasks.py
""" import logging
from celery import shared_task
from django.core.mail import EmailMessage, send_mail
from django.conf import settings

logger = logging.getLogger(__name__)

@shared_task()
def enviar_correo_task(asunto, cuerpo, destinatarios, reply_to):
    try:
        email = EmailMessage(
            subject=asunto,
            body=cuerpo,
            from_email=settings.EMAIL_HOST_USER,
            to=destinatarios,
            reply_to=[reply_to],
        )
        email.send()
        send_mail(asunto,cuerpo,'tfghermandades@gmail.com',destinatarios)
        logger.info(f"Email sent to {destinatarios}")
    except Exception as e:
        logger.error(f"Error sending email: {e}") """
