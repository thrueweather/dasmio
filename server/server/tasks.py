from django.conf import settings
from django.template.loader import render_to_string
from django.core.exceptions import ObjectDoesNotExist
from django.core.mail import EmailMessage, send_mail

from accounts.models import User
from accounts.tokens import account_activation_token
from server.settings.dev import DEFAULT_FROM_EMAIL
from celery import shared_task

from accounts.utils import generate_four_digit_code
from server.settings.dev import CONTACT_EMAIL


@shared_task
def hello():
    print("Hello there!")


@shared_task(name="reset_password_email")
def reset_password_email(email):
    try:
        user = User.objects.get(email=email)
    except ObjectDoesNotExist as e:
        return str(e)
    token = account_activation_token.make_token(user)

    body = """
        Click here to reset your password:
        {site_url}/reset-password/{user_id}/{token}
    """.format(
        site_url=settings.SITE_URL, user_id=user.id, token=token
    )

    email = EmailMessage("title", body, to=[email])
    email.send()

    return 'success'


@shared_task(name="send_verification_code")
def send_verification_code(email, subject='Test'):
    code = generate_four_digit_code()
    if subject.lower() == 'reset password':
        html_message = render_to_string(
            'accounts/forgot_password.html', {'code': code, 'email': email})
    else:
        html_message = render_to_string(
            'accounts/verification_code.html', {'code': code})
    send_mail(subject, '', DEFAULT_FROM_EMAIL,
              [email], html_message=html_message, fail_silently=False)

    return code


@shared_task(name="contact_admin")
def contact_admin(email, message):
    message = message + "\nPlease contact me at: %s" % email
    send_mail(subject='Contact us', message=message,
              from_email=CONTACT_EMAIL, recipient_list=[CONTACT_EMAIL], fail_silently=False)
