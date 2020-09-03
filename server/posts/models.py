import enum
from datetime import datetime, timedelta

from django.db import models


class GenderChoices(enum.Enum):
    MAN = 'Man'
    WOMAN = 'Woman'
    NOT_MATTER = 'Not matter'


class Category(models.Model):
    name = models.CharField(max_length=255)
    use_for_matches = models.BooleanField(default=False)

    class Meta:
        verbose_name_plural = "categories"

    def __str__(self):
        return self.name


class Post(models.Model):
    profile = models.ForeignKey(
        'accounts.Profile', on_delete=models.CASCADE, related_name='posts')
    photos = models.ManyToManyField('photos.PostImage')
    looking_for = models.CharField(max_length=255, choices=[
                                   (tag.value, tag) for tag in GenderChoices])
    post_duration_hours = models.IntegerField(default=1)
    text = models.TextField()
    category = models.ForeignKey(
        'posts.Category', on_delete=models.CASCADE, related_name='posts')
    min_age = models.IntegerField(default=18)
    max_age = models.IntegerField(default=99)
    is_matches = models.BooleanField(default=False)
    liked_by = models.ManyToManyField(
        'accounts.Profile', related_name='liked_posts')
    date_created = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=False)

    def __str__(self):
        return "%d %s..." % (self.id, self.text[:20])

    def calculate_distance(self, point):
        return self.profile.user.location_point.distance(point) * 100  # in km

    @classmethod
    def delete_outdated_posts(cls):
        for post in cls.objects.all():
            current_time = datetime.now().replace(tzinfo=None)
            time_diff = current_time - post.date_created.replace(tzinfo=None)
            time_diff_in_hours = time_diff.seconds / 3600
            if time_diff_in_hours > post.post_duration_hours:
                post.is_active = False
                post.save()

    @property
    def expires_at(self):
        time_diff = self.date_created + \
            timedelta(hours=self.post_duration_hours)
        return time_diff
