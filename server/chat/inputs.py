import graphene


class RoomInput(graphene.InputObjectType):
    post_id = graphene.ID(required=True)


class MessageInput(graphene.InputObjectType):
    text = graphene.String(required=True)
    room_id = graphene.ID(required=True)
