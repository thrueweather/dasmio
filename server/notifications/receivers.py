from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


from posts.models import Post
from chat.models import Message
from .models import Notification
from .signals import *


channel_layer = get_channel_layer()


@receiver(post_delete, sender=Post)
def post_hidden_notification(sender, **kwargs):
    """ This signal creates notification instance after post deletion """

    post = kwargs["instance"]
    Notification.objects.create(
        profile=post.profile, action_type='Post is hidden', notification_text="Your post '%s' is hidden for now" % post.text[:20])


@receiver(posts_matched, sender=Post)
def posts_matched_notification(sender, **kwargs):
    """ This signal creates notification instance after posts match """

    post = kwargs["matched_post"]
    Notification.objects.create(
        profile=post.profile, action_type='New match', notification_text="You have new match for your post '%s'" % post.text[:20])


@receiver(new_like, sender=None)
def new_like_notification(sender, **kwargs):
    """ This signal creates notification instance when nww like appears """
    profile = kwargs['profile']
    Notification.objects.create(
        profile=profile, action_type='New like', notification_text="You have a new likes")


@receiver(new_superlike, sender=None)
def new_superlike_notification(sender, **kwargs):
    """This signal creates notification instance when new superlike appears"""

    profile = kwargs['profile']
    Notification.objects.create(
        profile=profile, action_type='New superlike', notification_text="You have a new SuperLike")


@receiver(new_listing_response, sender=None)
def new_lising_response_notification(sender, **kwargs):
    """This signal creates notification instance when user gets response for listing"""

    profile = kwargs['profile']
    Notification.objects.create(
        profile=profile, action_type='New listing response', notification_text="You have a new Listing response")


@receiver(post_save, sender=Message)
def new_lising_response_notification(sender, **kwargs):
    """This signal creates notification instance when user gets a new message in chat"""

    message = kwargs['instance']
    receiver = message.room.users.exclude(id=message.sender.id).first()
    Notification.objects.create(
        profile=receiver, action_type='New message', notification_text="You have a new message")


@receiver(post_save, sender=Notification)
def send_notification_to_subscription(sender, **kwargs):
    """This signal sends new notification instance to subsctiption channel"""

    notification = kwargs['instance']
    async_to_sync(channel_layer.group_send)(
        "notify_" + str(notification.profile.id), {"data": notification})
