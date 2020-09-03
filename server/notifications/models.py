from django.db import models
import enum


class ActionTypeChoices(enum.Enum):
    POST_IS_HIDDEN = 'Post is hidden'
    NEW_LIKE = 'New like'
    NEW_MATCH = 'New match'
    NEW_SUPERLIKE = 'New superlike'
    NEW_LISTING_RESPONSE = 'New listing response'
    NEW_MESSAGE = 'New message'
    NEW_POSTS_WAITING = 'New posts waiting'


class Notification(models.Model):
    profile = models.ForeignKey(
        'accounts.Profile', on_delete=models.CASCADE, related_name='notifications')
    action_type = models.CharField(
        max_length=255,
        choices=[(tag.value, tag) for tag in ActionTypeChoices])
    notification_text = models.CharField(max_length=255)
