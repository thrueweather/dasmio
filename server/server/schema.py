import graphene
import graphql_jwt
from channels.layers import get_channel_layer
from django.contrib.auth import get_user_model


from accounts.mutations import (
    LoginMutation,
    RegisterMutation,
    SocialAuth,
    VerifyUserMutation,
    ResendVerificationCodeMutation,
    SendForgotPasswordMutation,
    VerifyForgotPasswordMutation,
    ChangePasswordMutation,
    ContactUsMutation,
    CreateProfileMutation,
    SetActiveProfileMutation,
    AllowGeoLocationMutation
)
from accounts.schema import Query as AccountsQuery
from accounts.schema import UserType

from photos.mutations import (
    AddToGalleryMutation, SetAvatarMutation, UpdateImageMutation, DeleteImageMutation)
from photos.schema import Query as PhotosQuery
from posts.mutations import (
    CreatePostMutation, AddFavoritePostMutation, DislikePostMutation, RemoveFavoritePostMutation)
from posts.schema import Query as PostsQuery
from chat.mutations import (CreateRoomMutation, UpdateRoomMutation, MessageMutationDelete,
                            MessageCreateMutation, MessageUpdateMutation, ReadMessagesMutation, SuperLikePostMutation, LikePostMutation, AcceptRoomMutation)
from chat.schema import MessageType, Query as ChatQuery

from notifications.schema import Subscription as NotificationSubscription, Query as NotificationsQuery

channel_layer = get_channel_layer()


class Query(AccountsQuery, PhotosQuery, PostsQuery, ChatQuery, NotificationsQuery, graphene.ObjectType):
    pass


class Mutation(graphene.ObjectType):
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()
    register = RegisterMutation.Field()
    login = LoginMutation.Field()
    social_auth = SocialAuth.Field()
    verify_user = VerifyUserMutation.Field()
    resend_verification_code = ResendVerificationCodeMutation.Field()
    send_forgot_password = SendForgotPasswordMutation.Field()
    verify_forgot_password = VerifyForgotPasswordMutation.Field()
    change_password = ChangePasswordMutation.Field()
    contact_us = ContactUsMutation.Field()
    create_profile = CreateProfileMutation.Field()
    add_to_gallery = AddToGalleryMutation.Field()
    set_avatar = SetAvatarMutation.Field()
    update_image = UpdateImageMutation.Field()
    delete_image = DeleteImageMutation.Field()
    set_active_profile = SetActiveProfileMutation.Field()
    allow_geo_location = AllowGeoLocationMutation.Field()
    create_post = CreatePostMutation.Field()
    add_favorite_post = AddFavoritePostMutation.Field()
    dislike_post = DislikePostMutation.Field()
    delete_message = MessageMutationDelete.Field()
    create_message = MessageCreateMutation.Field()
    update_message = MessageUpdateMutation.Field()
    create_room = CreateRoomMutation.Field()
    reed_messages = ReadMessagesMutation.Field()
    update_room = UpdateRoomMutation.Field()
    remove_favorite_post = RemoveFavoritePostMutation.Field()
    super_like_post = SuperLikePostMutation.Field()
    like_post = LikePostMutation.Field()
    accept_room = AcceptRoomMutation.Field()


class Subscription(NotificationSubscription):
    """ All Subscriptions """
    new_message = graphene.Field(MessageType, channel_id=graphene.ID())
    on_focus = graphene.Boolean(room_id=graphene.ID())
    has_unreaded_messages = graphene.Boolean(user_id=graphene.ID())
    online_users = graphene.List(UserType)

    async def resolve_new_message(root, info, channel_id):
        """ Send new message to room channel over websocket """
        channel_name = await channel_layer.new_channel()
        await channel_layer.group_add("new_message_" + str(channel_id), channel_name)
        try:
            while True:
                message = await channel_layer.receive(channel_name)
                yield message["data"]
        finally:
            await channel_layer.group_discard("new_message_" + str(channel_id), channel_name)

    async def resolve_on_focus(root, info, room_id):
        """ Send send notification to chat if penpal is typing message """
        channel_name = await channel_layer.new_channel()
        await channel_layer.group_add("focused_" + str(room_id) + '_' + str(info.context['user'].id), channel_name)
        try:
            while True:
                focused = await channel_layer.receive(channel_name)
                yield focused['data']
        finally:
            await channel_layer.group_discard("focused_" + str(room_id) + '_' + str(info.context['user'].id), channel_name)

    async def resolve_has_unreaded_messages(root, info, user_id):
        """ Send notification for user if he has new unreaded message or he read messages """
        channel_name = await channel_layer.new_channel()
        await channel_layer.group_add("has_unreaded_messages_" + str(user_id), channel_name)
        try:
            while True:
                data = await channel_layer.receive(channel_name)
                yield data['data']
        finally:
            await channel_layer.group_discard("has_unreaded_messages_" + str(user_id), channel_name)

    async def resolve_online_users(root, info):
        """ Send live-time info about online/offline users to public channel over websockets """
        channel_name = await channel_layer.new_channel()
        await channel_layer.group_add("users", channel_name)
        try:
            while True:
                online_users = await channel_layer.receive(channel_name)
                users = get_user_model().objects.only('id', 'email', 'full_name', 'online')
                yield users
        finally:
            await channel_layer.group_discard("users", channel_name)


schema = graphene.Schema(
    query=Query,
    mutation=Mutation,
    subscription=Subscription
)
