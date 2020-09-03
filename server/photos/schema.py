import json

import graphene
from graphene_django.types import DjangoObjectType
from django.core import serializers

from .models import Image, Avatar, PostImage, SourceImage


class SourceImageType(DjangoObjectType):
    class Meta:
        model = SourceImage


class ImageType(DjangoObjectType):
    class Meta:
        model = Image


class AvatarType(DjangoObjectType):
    class Meta:
        model = Avatar


class PostImageType(DjangoObjectType):
    class Meta:
        model = PostImage


class Query:
    gallery = graphene.JSONString(page=graphene.Int(
        required=True), per_page=graphene.Int(required=True))

    def resolve_gallery(self, info, page, per_page):
        user = info.context.user

        gallery = list(user.gallery.filter(deleted=False))
        num_objects = len(gallery)

        gallery = sorted(
            gallery, key=lambda image: image.date_created, reverse=True)

        instances_to_miss = (page-1) * per_page
        upper_page_limit = page * per_page

        gallery = serializers.serialize(
            'json', gallery[instances_to_miss:upper_page_limit])
        gallery = json.loads(gallery)

        # [make json structure easier for client]
        for i in range(0, len(gallery)):
            del gallery[i]['model']
            image_id = int(gallery[i]['pk'])
            del gallery[i]['pk']
            gallery[i] = gallery[i]['fields']
            gallery[i]['id'] = image_id

        return {'gallery': gallery, 'numObjects': num_objects}
