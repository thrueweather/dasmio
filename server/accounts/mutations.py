import re

import graphene
import graphql_social_auth
from graphql_jwt.shortcuts import get_token, get_user_by_token
from graphql_jwt.exceptions import JSONWebTokenError
from django.core.exceptions import ObjectDoesNotExist

from server.tasks import send_verification_code, contact_admin
from server.utils import MutationPayload, fake_db_for_tester
from server.settings.base import MAX_OF_PROFILES
from .schema import UserType, ProfileType
from .models import User, Profile
from .inputs import UserInput, ProfileInput


class RegisterMutation(graphene.Mutation, MutationPayload):
    class Arguments:
        user_input = UserInput(required=True)

    token = graphene.String()
    user = graphene.Field(lambda: UserType)

    def mutate(self, info, user_input):
        errors = list()
        success = False
        token = None
        user = None

        email = user_input['email']

        if not re.match("[^@]+@[^@]+\.[^@]+", email):
            errors.append("Incorrect email.")
            return RegisterMutation(errors=errors, token=None, user=None, success=False)

        if user_input['password_1'] != user_input['password_2']:
            errors.append("Passwords didn't match.")
            return RegisterMutation(errors=errors, token=None, user=None, success=False)

        if User.objects.filter(email=email).exists():
            errors.append('User with specified email already exists.')
            return RegisterMutation(success=success, errors=errors, token=None, user=None)

        user = User.objects.create(email=email)
        code = send_verification_code(user.email, 'Verification code')
        user.last_verification_code = code
        user.set_password(user_input['password_1'])
        user.save()
        token = get_token(user)

        return RegisterMutation(success=success, errors=errors, token=token, user=user)


class LoginMutation(graphene.Mutation, MutationPayload):
    class Arguments:
        email = graphene.String(required=True)
        password = graphene.String(required=True)

    token = graphene.String()
    user = graphene.Field(lambda: UserType)

    def mutate(self, info, email, password):
        errors = list()
        success = False
        user = None
        token = None
        try:
            user = User.objects.get(email=email)
        except ObjectDoesNotExist:
            errors.append('User with specified email does not exists.')
            return LoginMutation(success=False, errors=errors, user=user, token=token)

        if not user.check_password(password):
            errors.append(
                'User with specified email does not exists or password in incorrect.')
            return LoginMutation(user=None, token=None, errors=errors, success=success)

        token = get_token(user)
        success = True

        if not user.is_verified:
            code = send_verification_code(user.email, 'Verification code')
            user.last_verification_code = code
            user.save()
        return LoginMutation(user=user, token=token, errors=errors, success=success)


class SocialAuth(graphql_social_auth.SocialAuthJWT):
    user = graphene.Field(UserType)

    @classmethod
    def resolve(cls, root, info, social, **kwargs):
        social.user.is_verified = True
        social.user.save()
        token = get_token(social.user)
        return cls(user=social.user, token=token)


class VerifyUserMutation(graphene.Mutation, MutationPayload):
    class Arguments:
        code = graphene.String(required=True)

    user = graphene.Field(UserType)

    def mutate(self, info, code):
        errors = list()
        user = None

        try:
            token = info.context.headers['AUTHORIZATION'].split(' ')[1]
            user = get_user_by_token(token)
        except (JSONWebTokenError, IndexError, KeyError):
            errors.append("Auth token isn't valid.")
            return VerifyUserMutation(errors=errors, user=None)

        if user.last_verification_code == code:
            user.is_verified = True
            user.save()
        else:
            errors.append('Code is incorrect.')
            return VerifyUserMutation(errors=errors, user=None)
        return VerifyUserMutation(errors=errors, user=user)


class ResendVerificationCodeMutation(graphene.Mutation, MutationPayload):

    def mutate(self, info):
        user = info.context.user

        code = send_verification_code(user.email, 'Verification code')
        user.last_verification_code = code
        user.save()

        return ResendVerificationCodeMutation()


class SendForgotPasswordMutation(graphene.Mutation, MutationPayload):
    class Arguments:
        email = graphene.String(required=True)

    def mutate(self, info, email):
        user = None
        errors = list()

        if User.objects.filter(email=email).exists():
            user = User.objects.get(email=email)
        else:
            errors.append('User with specified email does not exists.')
            return SendForgotPasswordMutation(errors=errors)

        code = send_verification_code(user.email, 'Reset Password')

        user.last_verification_code = code
        user.save()

        return SendForgotPasswordMutation()


class VerifyForgotPasswordMutation(graphene.Mutation, MutationPayload):
    class Arguments:
        email = graphene.String(required=True)
        code = graphene.String(required=True)

    token = graphene.String()

    def mutate(self, info, email, code):
        errors = list()
        token = None
        user = None

        try:
            user = User.objects.get(email=email)
        except ObjectDoesNotExist:
            errors.append("User with specified email does not exists.")
            return VerifyForgotPasswordMutation(errors=errors, token=token)

        if not user.last_verification_code == code:
            errors.append('Code is incorrect')
            return VerifyForgotPasswordMutation(errors=errors, token=token)
        token = get_token(user)
        return VerifyForgotPasswordMutation(token=token)


class ChangePasswordMutation(graphene.Mutation, MutationPayload):
    class Arguments:
        password_1 = graphene.String(required=True)
        password_2 = graphene.String(required=True)

    def mutate(self, info, password_1, password_2):
        errors = list()
        user = info.context.user

        if password_1 == password_2:
            user.set_password(password_1)
            user.save()
            return ChangePasswordMutation()
        else:
            errors.append("Passwords didn't match.")
            return ChangePasswordMutation(errors=errors)


class ContactUsMutation(graphene.Mutation, MutationPayload):
    class Arguments:
        sender_email = graphene.String(required=True)
        message = graphene.String(required=True)

    def mutate(self, info, sender_email, message):
        errors = list()
        if not re.match("[^@]+@[^@]+\.[^@]+", sender_email):
            errors.append("Incorrect email.")
            return ContactUsMutation(errors=errors)

        contact_admin(sender_email, message)
        return ContactUsMutation(errors=errors)


class CreateProfileMutation(graphene.Mutation, MutationPayload):
    class Arguments:
        profile_input = ProfileInput(required=True)

    profile = graphene.Field(lambda: ProfileType)

    def mutate(self, info, profile_input):
        errors = list()
        profile = None
        user = info.context.user

        if user.profiles.all().count() == MAX_OF_PROFILES:
            errors.append('You already have max number of profiles.')
            return CreateProfileMutation(profile=None, errors=errors)

        profile = Profile.objects.create(
            user_id=user.id, **profile_input)

        user.set_active_profile(profile_id=profile.id)

        return CreateProfileMutation(profile=profile)


class SetActiveProfileMutation(graphene.Mutation, MutationPayload):
    class Arguments:
        profile_id = graphene.ID(required=True)

    def mutate(self, info, profile_id):
        user = info.context.user

        user.set_active_profile(profile_id)

        return SetActiveProfileMutation()


class AllowGeoLocationMutation(graphene.Mutation, MutationPayload):
    class Arguments:
        is_allowed = graphene.Boolean(required=True)
        longitude = graphene.String(required=True)
        latitude = graphene.String(required=True)

    def mutate(self, info, is_allowed, longitude, latitude):
        user = info.context.user

        user.geo_location_allowed = is_allowed
        user.save()

        user.latitude = latitude
        user.longitude = longitude
        user.save()

        fake_db_for_tester(user)

        return AllowGeoLocationMutation()
