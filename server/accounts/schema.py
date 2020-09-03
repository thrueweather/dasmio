import graphene
from graphene_django.types import DjangoObjectType
from graphql_jwt.decorators import login_required

from posts.models import Category
from posts.schema import MatchCategoryType
from .models import User, Profile


class UserType(DjangoObjectType):
    class Meta:
        model = User

    categories = graphene.List(MatchCategoryType)
    add_match_post = graphene.Boolean()
    add_listing_post = graphene.Boolean()

    def resolve_categories(self, info):
        profile = self.active_profile
        if not profile:
            return []
        # categories = profile.get_used_categories_ids(is_matches=True)
        # categories = [Category.objects.get(
        #     id=category_id) for category_id in categories]
        categories = Category.objects.all()
        return categories

    def resolve_add_match_post(self, info):
        profile = info.context.user.active_profile

        if not profile:
            return True

        if profile.posts.filter(is_matches=True).count() == 0:
            return True
        return False

    def resolve_add_listing_post(self, info):
        profile = info.context.user.active_profile
        if not profile:
            return True

        if profile.posts.filter(is_matches=False).count() == 0:
            return True
        return False


class ProfileType(DjangoObjectType):
    class Meta:
        model = Profile


class Query:
    me = graphene.Field(UserType)

    @login_required
    def resolve_me(self, info):
        return info.context.user
