import graphene

from django.core.exceptions import ObjectDoesNotExist

from photos.models import Image, PostImage
from server.utils import MutationPayload
from .inputs import PostInput
from .schema import PostType
from .models import Post


class CreatePostMutation(graphene.Mutation, MutationPayload):
    class Arguments:
        post_input = PostInput(required=True)

    post = graphene.Field(lambda: PostType)

    def mutate(self, info, post_input):
        post = None
        user = info.context.user
        active_profile = user.profiles.get(is_active=True)

        photos_ids = post_input.pop('photos')
        photos = [Image.objects.get(id=photo_id) for photo_id in photos_ids]
        age = post_input.pop('age')

        post_duration_hours = post_input.pop('duration')
        post = Post.objects.create(
            profile=active_profile, post_duration_hours=post_duration_hours, min_age=age[0], max_age=age[1], **post_input)

        for photo in photos:
            post_photo = PostImage.objects.create(
                source=photo.source, image=photo.image)
            post.photos.add(post_photo)

        post.save()

        return CreatePostMutation(post=post)


class AddFavoritePostMutation(graphene.Mutation, MutationPayload):
    class Arguments:
        post_id = graphene.ID(required=True)

    def mutate(self, info, post_id):
        errors = list()
        active_profile = info.context.user.profiles.get(is_active=True)

        try:
            post = Post.objects.get(id=post_id)
            active_profile.favorite_posts.add(post)
            active_profile.save()
        except:
            errors.append('Post with provided id does not exists.')

        return AddFavoritePostMutation(errors=errors)


class RemoveFavoritePostMutation(graphene.Mutation, MutationPayload):
    class Arguments:
        post_id = graphene.ID(required=True)

    def mutate(self, info, post_id):
        errors = list()
        active_profile = info.context.user.profiles.get(is_active=True)

        try:
            post = Post.objects.get(id=post_id)
            active_profile.favorite_posts.set(
                active_profile.favorite_posts.all().exclude(id=post.id))
            active_profile.save()
        except ObjectDoesNotExist:
            errors.append('Post with provided id does not exists.')

        return RemoveFavoritePostMutation(errors=errors)


class DislikePostMutation(graphene.Mutation, MutationPayload):
    class Arguments:
        post_id = graphene.ID(required=True)

    def mutate(self, info, post_id):
        errors = list()
        active_profile = info.context.user.profiles.get(is_active=True)

        try:
            post = Post.objects.get(id=post_id)
            active_profile.disliked_posts.add(post)
            active_profile.save()
        except:
            errors.append('Post with provided id does not exists.')

        return AddFavoritePostMutation(errors=errors)
