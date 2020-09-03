import random

from django.core.management.base import BaseCommand
from django.db import IntegrityError
from faker import Faker

from accounts.factories import UserFactory, ProfileFactory
from photos.models import Image
from posts.factories import CategoryFactory, PostFactory
from server.utils import load_image_by_url

GENDERS = ['Man', 'Woman', 'Not matter']

fake = Faker()


class Command(BaseCommand):
    help = "Creates fake DB based on Factories"

    def handle(self, *args, **options):
        KHARKOV = [50.040156499999995, 36.3003934]
        SMELA = [49.2391097, 31.859249100000003]
        CITIES = [KHARKOV, SMELA]

        print("COMMAND STARTED")
        unique_categories = list()
        while len(unique_categories) < 5:
            unique_categories.append(fake.word())
            unique_categories = list(set(unique_categories))

        unique_emails = list()
        while len(unique_emails) < 100:
            unique_emails.append(fake.email())
            unique_emails = list(set(unique_emails))

        print("CREATING OF CATEGORIES")
        categories = [CategoryFactory(name=category)
                      for category in unique_categories]

        print("CREATING OF USERS-PROFILES-POSTS")
        iteration = 0
        for email in unique_emails:
            coords = random.choice(CITIES)
            try:
                user = UserFactory(
                    email=email, latitude=coords[0], longitude=coords[1], full_name=fake.name())
                user.set_password('qweqweqwe')
                user.save()
            except IntegrityError:
                print('EMAIL SKIPPED')
                continue

            try:
                image_url = fake.image_url()
                while "lorempixel" in image_url:
                    image_url = fake.image_url()
                image_path = load_image_by_url(image_url)
                image = Image.objects.create(
                    user=user, image=image_path)
            except Exception as e:
                print(e)
                continue

            profile = ProfileFactory(
                user=user, avatar=image, age=random.randint(18, 55))

            post = PostFactory(
                profile=profile, category=random.choice(categories), looking_for=random.choice(GENDERS))
            post.photos.add(image)
            post.save()

            print('{}/{}'.format(iteration, len(unique_emails)))
            iteration += 1

        print("COMMAND FINISHED")
