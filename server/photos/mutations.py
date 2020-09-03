import graphene
from graphene_file_upload.scalars import Upload
from django.core.exceptions import ObjectDoesNotExist
from PIL import Image as PillowImage

from accounts.models import Profile
from server.utils import MutationPayload
from server.settings.base import PILLOW_IMAGE_QUALITY
from .models import Image, Avatar, SourceImage
from .schema import ImageType


class AddToGalleryMutation(graphene.Mutation, MutationPayload):
    class Arguments:
        upload = Upload(required=True)
        source_image = Upload(required=True)

    image = graphene.Field(lambda: ImageType)

    def mutate(self, info, upload, source_image):
        user = info.context.user
        errors = list()
        image = None

        try:
            source_image = SourceImage.objects.create(
                user=user, image=source_image)
            image = Image.objects.create(
                user=user, image=upload, source=source_image)
            pillow_image = PillowImage.open(image.image)
            pillow_image.save(image.image.path, 'PNG',
                              quality=PILLOW_IMAGE_QUALITY)
            src_pillow_image = PillowImage.open(source_image.image)
            src_pillow_image.save(source_image.image.path, 'PNG',
                                  quality=PILLOW_IMAGE_QUALITY)
        except Exception:
            errors.append("Image with this extension can't be uploaded.")
            return AddToGalleryMutation(image=image, errors=errors)
        return AddToGalleryMutation(image=image, errors=errors)


class SetAvatarMutation(graphene.Mutation, MutationPayload):
    class Arguments:
        # image_id = graphene.ID(required=True)
        profile_id = graphene.ID(required=True)
        upload = Upload(required=True)
        gallery_image_id = graphene.ID(required=True)

    def mutate(self, info, profile_id, upload, gallery_image_id):
        errors = list()
        gallery_image = Image.objects.get(id=gallery_image_id)
        try:
            profile = Profile.objects.get(id=profile_id)
            avatar = Avatar.objects.create(
                user=info.context.user, image=upload, source=gallery_image.source)
        except ObjectDoesNotExist:
            errors.append('Profile or photo with current id does not exists.')
            return SetAvatarMutation(errors=errors)

        profile.avatar = avatar
        profile.save()

        return SetAvatarMutation()


class UpdateImageMutation(graphene.Mutation, MutationPayload):
    class Arguments:
        image_id = graphene.ID(required=True)
        upload = Upload(required=True)

    def mutate(self, info, image_id, upload):
        errors = list()

        try:
            image = Image.objects.get(id=image_id)
            image.image = upload
            image.save()
        except ObjectDoesNotExist:
            errors.append('Image with current id does not exists.')
            return UpdateImageMutation(errors=errors)

        return UpdateImageMutation(errors=errors)


class DeleteImageMutation(graphene.Mutation, MutationPayload):
    class Arguments:
        image_id = graphene.ID(required=True)

    def mutate(self, info, image_id):
        errors = list()

        try:
            Image.objects.get(id=image_id).delete()
        except ObjectDoesNotExist as e:
            errors.append(str(e))

        return DeleteImageMutation(errors=errors)
