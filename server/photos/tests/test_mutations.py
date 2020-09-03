from PIL import Image

import pytest
from graphene.test import Client
from faker import Faker

from photos.models import Image, SourceImage
from accounts.factories import UserFactory, ProfileFactory
from server.schema import schema

fake = Faker()


@pytest.mark.django_db
def test_add_to_gallery_mutation_1(snapshot, request):
    """ Test a success add to gallery mutation"""

    upload = "server/media/gallery/example_pic.jpg"
    user = UserFactory()
    request.user = user

    client = Client(schema, context=request)
    executed = client.execute('''
        mutation addToGallery($upload: Upload!, $sourceImage: Upload!) {
            addToGallery(upload: $upload, sourceImage: $sourceImage) {
            image {
                id
                image
                user {
                id
                email
                }
                deleted
            }
            }
    }
    ''', variables={"upload": upload, "sourceImage": upload})

    snapshot.assert_match(executed)


@pytest.mark.django_db
def test_set_avatar_mutation_1(snapshot, request):
    """ Test a successful set avatar mutation"""

    upload = "server/media/avatars/example_pic.jpg"
    user = UserFactory()
    profile = ProfileFactory(user=user)
    request.user = user
    source_image = SourceImage.objects.create(image=upload, user=user)
    image = Image.objects.create(user=user, image=upload, source=source_image)

    client = Client(schema, context=request)
    executed = client.execute('''
        mutation setAvatar($profileId: ID!, $upload: Upload!, $galleryImageId: ID!) {
            setAvatar(
            profileId: $profileId
            upload: $upload
            galleryImageId: $galleryImageId
            ) {
            errors
            success
            }
        }
    ''', variables={"upload": upload, "galleryImageId": image.id, "profileId": profile.id})

    snapshot.assert_match(executed)
