import graphene
from graphene_file_upload.scalars import Upload


class UserInput(graphene.InputObjectType):
    email = graphene.String(required=True)
    password_1 = graphene.String(required=True)
    password_2 = graphene.String(required=True)


class UserEditInput(graphene.InputObjectType):
    email = graphene.String(required=True)
    full_name = graphene.String(required=True)
    avatar = graphene.String(required=True)


class ProfileInput(graphene.InputObjectType):
    name = graphene.String(required=True)
    education = graphene.String()
    job = graphene.String()
    description = graphene.String()
    age = graphene.Int(required=True)
    gender = graphene.String(required=True)
