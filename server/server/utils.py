import uuid
import random
import shutil
import os

import requests
import graphene
from faker import Faker
from django.db import IntegrityError

from accounts.factories import UserFactory, ProfileFactory
from posts.factories import PostFactory
from posts.models import Category
from photos.models import Image, Avatar, PostImage, SourceImage

fake = Faker()

GENDERS = ['Man', 'Woman', 'Not matter']


class MutationPayload(graphene.ObjectType):
    success = graphene.Boolean(required=True)
    errors = graphene.List(graphene.String, required=True)

    def resolve_success(self, info):
        return len(self.errors or []) == 0

    def resolve_errors(self, info):
        return self.errors or []


def load_image_by_url(url):
    filename = str(uuid.uuid1())
    r = requests.get(url, allow_redirects=True)

    open("server/media/gallery/%s.png" % filename, 'wb').write(r.content)
    # Image.objects.create(user=user, image="gallery/%s.png" % filename)
    return "gallery/%s.png" % filename


def generate_fake_emails(emails_count):
    unique_emails = list()
    while len(unique_emails) < emails_count:
        unique_emails.append(fake.email())
        unique_emails = list(set(unique_emails))
    return unique_emails


def generate_unique_categories(categories_count):
    unique_categories = list()
    while len(unique_categories) < categories_count:
        unique_categories.append(fake.word())
        unique_categories = list(set(unique_categories))
    categories = [Category.objects.create(
        name=category) for category in unique_categories]

    return categories


def copy_image(copy_from, copy_to):
    os.system('cp {} {}'.format(copy_from, copy_to))
    return copy_to


def fake_db_for_tester(user):
    EXAMPLE_PIC_PATH = 'server/media/gallery/example_pic.jpg'
    first_image = shutil.copy(
        EXAMPLE_PIC_PATH, 'server/media/gallery/example_pic_%d.jpg' % user.id)
    source = shutil.copy(
        EXAMPLE_PIC_PATH, 'server/media/source/example_pic_%d.jpg' % user.id)
    source_image = SourceImage.objects.create(
        user=user, image=source[13:])
    image = Image.objects.create(
        user=user, image=first_image[12:], source=source_image)
    emails = generate_fake_emails(50)
    if Category.objects.all().count() < 3:
        Category.objects.create(name='Sport')
        Category.objects.create(name='Dating')
        Category.objects.create(name='Food')
    categories = Category.objects.all()

    for email in emails:
        try:
            user = UserFactory(
                email=email, latitude=user.latitude, longitude=user.longitude, full_name=fake.name(), )
            user.set_password('qweqweqwe')
            user.save()
        except IntegrityError:
            print('EMAIL SKIPPED')
            continue
        new_image = shutil.copy(
            EXAMPLE_PIC_PATH, 'server/media/gallery/example_pic_%d.jpg' % user.id)
        try:
            image = Image.objects.create(
                user=user, image=new_image[12:])
            avatar = Avatar.objects.create(
                user=user, image=new_image[12:], source=source_image)
        except Exception as e:
            print(e)
            continue

        profile = ProfileFactory(
            user=user, avatar=avatar, age=random.randint(18, 55), name=fake.name())

        post = PostFactory(
            profile=profile, category=random.choice(categories), looking_for=random.choice(GENDERS), text=fake.text()[:random.randint(0, 500)])
        post = PostFactory(
            profile=profile, category=random.choice(categories), looking_for=random.choice(GENDERS), text=fake.text()[:random.randint(0, 500)], is_matches=True)

        images = Image.objects.all()
        asd = "1.jpeg"  # str(uuid.uuid1())
        post_image_path = copy_image("server/media/gallery/%s" % image.file_name,
                                     "server/media/gallery_edited/%s" % asd)

        post_image_1 = PostImage.objects.create(
            image='gallery_edited/1.jpeg', source=source_image)
        post_image_2 = PostImage.objects.create(
            image='gallery_edited/1.jpeg', source=source_image)
        post_image_3 = PostImage.objects.create(
            image='gallery_edited/1.jpeg', source=source_image)
        post.photos.add(post_image_1)
        post.photos.add(post_image_2)
        post.photos.add(post_image_3)

        post.save()
