import graphene
from graphene_django.types import DjangoObjectType

from django.contrib.auth import get_user_model

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

from chat.models import Message, Room  # , MessageFile

from posts.schema import PostType


channel_layer = get_channel_layer()


# class MessageFileType(DjangoObjectType):
#     """ Object type for files in messages """
#     size = graphene.Int()

#     class Meta:
#         model = MessageFile

#     def resolve_size(self, info):
#         return self.file.size


class MessageType(DjangoObjectType):
    """ Message object type for GraphQL """

    class Meta:
        model = Message


class RoomType(DjangoObjectType):
    """ Room object type for GraphQL """
    unviewed_messages = graphene.Int(user_id=graphene.Int())
    messages = graphene.List(
        MessageType,
        first=graphene.Int(),
        skip=graphene.Int(),
        room=graphene.Int(),
        first_user=graphene.ID(),
        second_user=graphene.ID()
    )
    receiver_post = graphene.Field(lambda: PostType)

    class Meta:
        model = Room

    def resolve_unviewed_messages(self, info, user_id=None):
        # Return count of unread messages
        if user_id:
            user = get_user_model().objects.get(pk=user_id)
            return self.messages.filter(seen=False, is_deleted=False).exclude(sender=user).count()

    def resolve_messages(self, info, first=None, skip=None, room=None, first_user=None, second_user=None):
        # Return all messages in room
        if room:
            room = Room.objects.get(pk=room)
        else:
            room = Room.objects.filter(users=first_user).filter(
                users=second_user).first()
        qs = Message.objects.filter(
            room=room, is_deleted=False).order_by('time')
        if skip:
            qs = qs[skip:]
        if first:
            qs = qs[:first]
        return qs

    def resolve_receiver_post(self, info):
        me = info.context.user.active_profile
        interlocutor = self.users.exclude(id=me.id).first()

        receiver_post = interlocutor.liked_posts.filter(
            category_id=self.post.category_id, profile_id=me.id).first()
        return receiver_post


class Query:
    rooms = graphene.List(RoomType, user_id=graphene.Int())
    room = graphene.Field(RoomType, id=graphene.Int(),
                          first_user=graphene.ID(), second_user=graphene.ID(), first=graphene.Int(), skip=graphene.Int())
    type = graphene.Field(RoomType, id=graphene.Int())
    on_focus = graphene.Boolean(
        focused=graphene.Boolean(), room_id=graphene.ID())
    listing_rooms = graphene.List(RoomType)
    matches_rooms = graphene.List(RoomType)

    def resolve_room(self, info, id=None, first_user=None, second_user=None, first=None, skip=None, ):
        # Return room with provided ID
        if id:
            room = Room.objects.get(id=id)
            return room
        if first_user and second_user:
            room = Room.objects.filter(users=first_user).filter(
                users=second_user).first()
            return room
        # if not room:
        #     room = Room.objects.create()
        #     user1 = get_user_model().objects.get(pk=first_user).active_profile
        #     user2 = get_user_model().objects.get(pk=second_user).active_profile
        #     room.users.add(user1)
        #     room.users.add(user2)
        #     room.save()
        # if room.last_message:
        #     room.typing = False
        #     room.last_message.save()

        return room

    def resolve_type(self, info, id):
        room = Room.objects.get(id=id)
        room.typing = True
        room.save()

        return room

    def resolve_rooms(self, info, user_id):
        # Return all rooms for provided user ID
        # Room.objects.filter(users__id=user_id)
        return info.context.user.active_profile.rooms.filter(waiting_for_approve=False)

    def resolve_on_focus(self, info, room_id=None, focused=None):
        # Return True or False depending on if user typing message
        if focused is not None and room_id and info.context.user:
            penpal = Room.objects.get(pk=room_id).users.exclude(
                pk=info.context.user.pk).first()
            async_to_sync(channel_layer.group_send)(
                "focused_" + str(room_id) + '_' + str(penpal.pk), {"data": focused})
            return focused
        return False

    def resolve_listing_rooms(self, info):
        profile = info.context.user.active_profile
        return profile.rooms.filter(post__is_matches=False)

    def resolve_matches_rooms(self, info):
        profile = info.context.user.active_profile
        return profile.rooms.filter(post__is_matches=True, waiting_for_approve=True)
