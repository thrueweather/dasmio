import random

import factory
from faker import Faker

from accounts.factories import ImageFactory, ProfileFactory
fake = Faker()

GENDERS = ["Man", "Woman", "Not matter"]


class CategoryFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "posts.Category"

    name = fake.word()


class PostFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "posts.Post"

    profile = factory.SubFactory(ProfileFactory)
    looking_for = random.choice(GENDERS)
    post_duration_hours = random.randint(1, 72)
    text = fake.text()[:100]
    category = factory.SubFactory(CategoryFactory)
    min_age = random.randint(18, 50)
    max_age = random.randint(51, 100)
