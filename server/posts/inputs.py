import graphene


class PostInput(graphene.InputObjectType):
    photos = graphene.List(graphene.ID, required=True)
    looking_for = graphene.String(required=True)
    duration = graphene.Int(required=True)
    category_id = graphene.ID(required=True)
    text = graphene.String(required=True)
    age = graphene.List(graphene.Int, required=True)
    is_matches = graphene.Boolean(required=True)
