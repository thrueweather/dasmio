
import graphene
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from serious_django_graphene import FormMutation
from django.core.exceptions import ObjectDoesNotExist

from notifications.signals import posts_matched, new_like, new_superlike, new_listing_response
from posts.models import Post
from server.utils import MutationPayload
from .inputs import RoomInput, MessageInput
from .forms import MessageForm
from chat.models import Message, Room  # , MessageFile
from chat.schema import MessageType, RoomType


channel_layer = get_channel_layer()


class CreateRoomMutation(graphene.Mutation, MutationPayload):
    """ Mutation for creating Chat Room """
    class Arguments:
        room_input = RoomInput(required=True)

    room = graphene.Field(lambda: RoomType)

    def mutate(self, info, room_input):
        room = None
        errors = list()
        post_id = room_input['post_id']

        post = Post.objects.get(id=post_id)
        sender = info.context.user.active_profile
        receiver = post.profile

        if Room.exists(sender.id, receiver.id, post_id):
            errors.append('Room for this post already exists.')
            return CreateRoomMutation(room=room, errors=errors)

        room = Room.objects.create(post_id=post_id)

        room.users.add(receiver)
        room.users.add(sender)
        room.save()

        new_listing_response.send(sender=None, profile=receiver)

        return CreateRoomMutation(room=room, errors=errors)


class UpdateRoomMutation(graphene.Mutation):
    """ Mutation for editing Chat Room """
    class Arguments:
        room_id = graphene.ID(required=True)
        is_typing = graphene.Boolean(required=True)

    errors = graphene.List(graphene.String)
    success = graphene.Boolean()

    @staticmethod
    def mutate(root, info, **args):
        errors = list()
        success = True
        room_id = args.pop('room_id', None)
        is_typing = args.pop('is_typing', None)

        room = Room.objects.get(id=room_id)
        room.typing = is_typing
        room.save()

        return UpdateRoomMutation(errors=errors, success=success)


class MessageMutationDelete(graphene.Mutation):
    """ Mutation for deleting Chat Message """
    class Arguments:
        message_id = graphene.ID()

    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    @staticmethod
    def mutate(root, info, **args):
        message_id = args.get('message_id')
        errors = []
        success = False

        if not message_id:
            errors.message_id('Message must be specified')

        if not errors:
            try:
                message = Message.objects.get(id=message_id)
                message.is_deleted = True
                message.save()
                success = True
                async_to_sync(channel_layer.group_send)(
                    "new_message", {"data": message})
            except Message.DoesNotExist:
                errors.append('Message with provided ID does not exist')

        return MessageMutationDelete(errors=errors, success=success)


class MessageCreateMutation(graphene.Mutation, MutationPayload):
    """ Mutation to create Chat Message """
    class Arguments:
        message_input = MessageInput(required=True)

    message = graphene.Field(lambda: MessageType)

    def mutate(root, info, message_input):
        """ Create message if there's file or text or both """
        user = info.context.user.active_profile
        room = Room.objects.get(pk=message_input['room_id'])

        message = Message.objects.create(
            room=room, text=message_input['text'], sender=user)

        reciever_id = room.users.exclude(pk=message.sender.pk).first().pk

        room.last_message = message
        room.save()

        # Send data over websockets
        async_to_sync(channel_layer.group_send)(
            "new_message_" + str(message.room.id), {"data": message})
        async_to_sync(channel_layer.group_send)(
            "notify_" + str(reciever_id), {"data": room})
        async_to_sync(channel_layer.group_send)(
            "has_unreaded_messages_" + str(reciever_id), {"data": True})

        return MessageCreateMutation(message=message)


class MessageUpdateMutation(FormMutation):
    """ Mutation for editing Chat Message """
    class Meta:
        form_class = MessageForm

    message = graphene.Field(lambda: MessageType)

    @classmethod
    def perform_mutate(cls, form, info):
        message = Message.objects.get(id=form.cleaned_data['message_id'])
        message.text = form.cleaned_data['text']
        message.save()

        # Send message over websockets
        async_to_sync(channel_layer.group_send)(
            "new_message_" + str(message.room.id), {"data": message})

        return cls(message=message)


class ReadMessagesMutation(graphene.Mutation):
    """ Mutation to mark Chat Messages as read """
    class Arguments:
        room_id = graphene.ID(required=True)

    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    @staticmethod
    def mutate(root, info, room_id):
        success = True
        errors = list()
        user = info.context.user

        unread_messages = Message.objects.filter(
            room_id=room_id, seen=False).exclude(sender_id=user.id)

        for message in unread_messages:
            message.seen = True
            message.save()
            async_to_sync(channel_layer.group_send)(
                "new_message_" + str(room_id), {"data": message})
        async_to_sync(channel_layer.group_send)(
            "notify_" + str(user.id), {"data": Room.objects.get(id=room_id)})

        unreaded_rooms = user.rooms.all()
        unreaded_rooms = unreaded_rooms.filter(last_message__seen=False).exclude(
            last_message__sender_id=user.id)

        # Send True or False over websocket depending on if user has unreaded messages
        if(len(unreaded_rooms) > 0):
            async_to_sync(channel_layer.group_send)(
                "has_unreaded_messages_" + str(user.id), {"data": True})
        else:
            async_to_sync(channel_layer.group_send)(
                "has_unreaded_messages_" + str(user.id), {"data": False})

        return ReadMessagesMutation(success=success, errors=errors)


class SuperLikePostMutation(graphene.Mutation, MutationPayload):
    class Arguments:
        post_id = graphene.ID(required=True)
        text = graphene.String(required=True)

    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    def mutate(self, info, post_id, text):
        errors = list()
        active_profile = info.context.user.active_profile
        post = None

        try:
            post = Post.objects.get(id=post_id)
        except ObjectDoesNotExist:
            errors.append('Post with specified ID does not exists.')
            return SuperLikePostMutation(errors=errors)
        room = Room.objects.create(post_id=post_id)
        message = Message.objects.create(
            text=text, sender=active_profile, room=room, seen=False)
        room.users.add(active_profile)
        room.users.add(post.profile)
        room.last_message = message
        room.save()

        async_to_sync(channel_layer.group_send)(
            "new_message_" + str(message.room.id), {"data": message})
        async_to_sync(channel_layer.group_send)(
            "has_unreaded_messages_" + str(post.profile.id), {"data": True})
        new_superlike.send(sender=None, profile=post.profile)
        return SuperLikePostMutation(errors=errors)


class LikePostMutation(graphene.Mutation, MutationPayload):
    class Arguments:
        post_id = graphene.ID(required=True)

    room = graphene.Field(lambda: RoomType)
    redirect = graphene.Boolean()
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    def mutate(self, info, post_id):
        errors = list()
        redirect = False
        room = None
        profile = info.context.user.active_profile
        match = None

        try:
            match = Post.objects.get(id=post_id)
            match.liked_by.add(profile)
            profile.favorite_posts.add(match)
            match.save()
            new_like.send(sender=None, profile=match.profile)
        except ObjectDoesNotExist:
            errors.append('Match with specified ID does not exists.')

        receiver_profile = match.profile
        receiver_liked_by = receiver_profile.who_liked_matches
        sender_liked_by = profile.who_liked_matches

        if receiver_profile in sender_liked_by and profile in receiver_liked_by and not Room.exists(receiver_profile.id, profile.id, match.id):
            room = Room.objects.create(post=match)
            room.users.add(profile)
            room.users.add(receiver_profile)
            room.save()
            redirect = True
            posts_matched.send(sender=match.__class__, matched_post=match)
        elif Room.exists(receiver_profile.id, profile.id, match.id):
            room = Room.get_by_users(receiver_profile.id, profile.id)

        return LikePostMutation(errors=errors, room=room, redirect=redirect)


class AcceptRoomMutation(graphene.Mutation, MutationPayload):
    class Arguments:
        room_id = graphene.ID(required=True)
        accept = graphene.Boolean(required=True)

    room = graphene.Field(lambda: RoomType)

    def mutate(self, info, room_id, accept):
        errors = list()
        room = None

        try:
            room = Room.objects.get(id=room_id)
        except ObjectDoesNotExist:
            errors.append('Room with specified id does not exists')
            return AcceptRoomMutation(errors=errors, room=None)

        if accept:
            room.waiting_for_approve = True
        else:
            room.waiting_for_approve = False

        room.save()

        return AcceptRoomMutation(errors=errors, room=room)
