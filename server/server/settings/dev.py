import os

from .base import *  # noqa

DEBUG = True
ALLOWED_HOSTS = ["*"]
CORS_ORIGIN_ALLOW_ALL = True

SITE_URL = "http://localhost:3000"

# email
# EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

# [START OF SENDGRID SETTINGS]
DEFAULT_FROM_EMAIL = os.environ.get("DEFAULT_FROM_EMAIL", 'test@test.com')
EMAIL_PORT = os.environ.get("EMAIL_PORT", '587')
CONTACT_EMAIL = os.environ.get('CONTACT_EMAIL', 'alextestservice@gmail.com')
EMAIL_USE_TLS = True
EMAIL_HOST = 'smtp.mailgun.org'
EMAIL_BACKEND = "sendgrid_backend.SendgridBackend"
SENDGRID_API_KEY = os.environ.get("SENDGRID_API_KEY", '')
SENDGRID_SANDBOX_MODE_IN_DEBUG = False
# [END OF SENDGRID SETTINGS]
