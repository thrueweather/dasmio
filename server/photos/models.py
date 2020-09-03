from django.db import models


class SourceImage(models.Model):
    image = models.ImageField(
        upload_to='source/', null=True, blank=True
    )
    user = models.ForeignKey(
        'accounts.User', related_name='source_images', on_delete=models.CASCADE)
    date_created = models.DateTimeField(auto_now=True)


class Image(models.Model):
    image = models.ImageField(
        upload_to='gallery/', null=True, blank=True
    )
    user = models.ForeignKey(
        'accounts.User', related_name='gallery', on_delete=models.CASCADE)
    deleted = models.BooleanField(default=False)
    date_created = models.DateTimeField(auto_now=True)
    source = models.ForeignKey('photos.SourceImage', null=True, blank=True,
                               on_delete=models.SET_NULL, related_name='gallery_images')

    @property
    def file_name(self):
        return self.image.name.split('/')[-1]


class Avatar(models.Model):
    image = models.ImageField(
        upload_to='avatars/', null=True, blank=True
    )
    user = models.ForeignKey(
        'accounts.User', related_name='avatars', on_delete=models.CASCADE)
    source = models.ForeignKey('photos.SourceImage', null=True, blank=True,
                               on_delete=models.SET_NULL, related_name='avatars')
    deleted = models.BooleanField(default=False)
    date_created = models.DateTimeField(auto_now=True)


class PostImage(models.Model):
    source = models.ForeignKey(
        'photos.SourceImage', null=True, blank=True, on_delete=models.SET_NULL)
    image = models.ImageField(
        upload_to='gallery_edited/')
