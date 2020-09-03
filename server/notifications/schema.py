import graphene
from graphene_django.types import DjangoObjectType
from channels.layers import get_channel_layer

from .models import Notification

channel_layer = get_channel_layer()


class NotificationType(DjangoObjectType):
    class Meta:
        model = Notification


class Subscription(graphene.ObjectType):
    notifications = graphene.Field(NotificationType, profileId=graphene.Int())

    async def resolve_notifications(root, info, profileId):
        """ Send notification to channel of provided user over websocket """
        channel_name = await channel_layer.new_channel()
        await channel_layer.group_add("notify_" + str(profileId), channel_name)
        try:
            while True:
                notification = await channel_layer.receive(channel_name)
                yield notification["data"]
        finally:
            await channel_layer.group_discard("notify_" + str(profileId), channel_name)


class Query:
    notifications = graphene.List(NotificationType)

    def resolve_notifications(self, info):
        profile = info.context.user.active_profile
        profile_notifications = list(profile.notifications.all())
        for notification in profile_notifications[:-10]:
            notification.delete()
        return list(profile.notifications.all())
