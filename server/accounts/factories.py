# Write your factories for tests here
import random
from datetime import datetime

import factory
from faker import Faker

# from server.utils import load_image_by_url

fake = Faker()

GENDERS = ["Male", "Female"]


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'accounts.User'

    email = factory.Sequence(lambda n: 'email%s@gmail.com' % n)
    full_name = factory.Sequence(lambda n: 'John%s Smith' % n)
    date_joined = datetime.now()
    is_active = True
    is_staff = False
    latitude = 0
    longitude = 0
    is_verified = True
    geo_location_allowed = True


class ImageFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "photos.Image"

    user = factory.SubFactory(UserFactory)
    # image = load_image_by_url(fake.image_url())


class ProfileFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "accounts.Profile"

    user = factory.SubFactory(UserFactory)
    # avatar = factory.SubFactory(ImageFactory)
    name = factory.Sequence(lambda n: 'John%s Profile' % n)
    education = fake.word()
    job = fake.job()
    description = fake.text()[:100]
    age = 21
    gender = GENDERS[0]
    is_active = True
