import enum

from django.db import models
from django.core.mail import send_mail
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.gis.geos import Point
from django.utils.translation import ugettext_lazy as _

from .managers import UserManager


class GenderChoices(enum.Enum):
    MALE = 'Male'
    FEMALE = 'Female'


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(_('email address'), unique=True)
    full_name = models.CharField(_('full name'), max_length=64, blank=True)
    date_joined = models.DateTimeField(_('date joined'), auto_now_add=True)
    is_active = models.BooleanField(_('active'), default=True)
    is_staff = models.BooleanField(_('staff'), default=True)
    is_verified = models.BooleanField(default=False)
    last_verification_code = models.CharField(blank=True, max_length=4)
    geo_location_allowed = models.BooleanField(default=False)
    latitude = models.CharField(blank=True, max_length=255)
    longitude = models.CharField(blank=True, max_length=255)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')

    def __str__(self):
        return "%d %s" % (self.id, self.email)

    def email_user(self, subject, message, from_email=None, **kwargs):
        '''
        Sends an email to this User.
        '''
        send_mail(subject, message, from_email, [self.email], **kwargs)

    def set_active_profile(self, profile_id):
        for profile in self.profiles.all():
            profile.is_active = False
            profile.save()

        active_profile = self.profiles.get(id=profile_id)
        active_profile.is_active = True
        active_profile.save()

    @property
    def active_profile(self):
        if self.profiles.all().count() > 0:
            return self.profiles.get(is_active=True)

        return None

    @property
    def location_point(self):
        return Point(float(self.latitude), float(self.longitude))


class Profile(models.Model):
    user = models.ForeignKey(
        'accounts.User', on_delete=models.CASCADE, related_name='profiles')
    name = models.CharField(max_length=255)
    education = models.CharField(max_length=255, blank=True)
    job = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    age = models.IntegerField()
    gender = models.CharField(
        max_length=255,
        choices=[(tag.value, tag) for tag in GenderChoices])
    avatar = models.ForeignKey(
        'photos.Avatar', null=True, blank=True, on_delete=models.SET_NULL)
    is_active = models.BooleanField(default=False)

    favorite_posts = models.ManyToManyField(
        'posts.Post', null=True, blank=True, related_name='favorite_posts')
    disliked_posts = models.ManyToManyField(
        'posts.Post', null=True, blank=True, related_name='disliked_posts')

    def __str__(self):
        return "%d %s %s" % (self.id, self.name, self.user.email)

    @property
    def who_liked_matches(self):
        profiles = [profile for post in self.posts.all()
                    for profile in post.liked_by.all()]

        return profiles

    def get_used_categories_ids(self, is_matches):
        posts = self.posts.filter(is_matches=is_matches)
        categories_ids = [post.category.id for post in posts]
        return categories_ids

    @property
    def has_matches_created(self):
        return bool(self.posts.filter(is_matches=True))
