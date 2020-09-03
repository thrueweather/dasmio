import graphene

from graphene_django.types import DjangoObjectType

from .models import Post, Category
from chat.models import Room


class PostType(DjangoObjectType):
    class Meta:
        model = Post

    distance = graphene.Float()
    has_room = graphene.Boolean()
    expires_at = graphene.DateTime()

    def resolve_distance(self, info):
        profile = info.context.user.profiles.all().get(is_active=True)

        distance = self.calculate_distance(
            profile.user.location_point)

        return distance

    def resolve_has_room(self, info):
        profile = info.context.user.active_profile
        receiver_profile = self.profile
        if Room.exists(profile.id, receiver_profile.id, self.id):
            return True

        return False

    def resolve_expires_at(self, info):
        return self.expires_at


class CategoryType(DjangoObjectType):
    class Meta:
        model = Category


class MatchCategoryType(DjangoObjectType):
    class Meta:
        model = Category

    has_posts = graphene.Boolean()

    posts = graphene.List(PostType)

    def resolve_has_posts(self, info):
        profile = info.context.user.active_profile
        used_categories = profile.get_used_categories_ids(is_matches=True)
        return bool(self.id in used_categories)

    def resolve_posts(self, info):
        profile = info.context.user.active_profile
        posts = Post.objects.filter(
            profile_id=profile.id, category_id=self.id, is_matches=True)
        return posts


class ListingList(graphene.ObjectType):
    listing = graphene.List(PostType)
    num_objects = graphene.Int()
    has_posts = graphene.Boolean()
    add_post = graphene.Boolean()
    sorry = graphene.Boolean()


RADIUS_FOR_POSTS = 25  # in km


class Query:
    listing = graphene.Field(ListingList, category_id=graphene.String(), looking_for=graphene.String(
    ), min_age=graphene.Int(), max_age=graphene.Int(), favorite=graphene.Boolean(), page=graphene.Int(
        required=True), per_page=graphene.Int(required=True))
    categories = graphene.List(CategoryType)
    matches = graphene.Field(ListingList, post_id=graphene.ID(
        required=True), liked_me=graphene.Boolean(required=True), page=graphene.Int(
        required=True), per_page=graphene.Int(required=True))
    matches_categories = graphene.List(MatchCategoryType)
    settings_listing = graphene.Field(
        ListingList, category_id=graphene.ID(required=True), status=graphene.String(required=True),  page=graphene.Int(
            required=True), per_page=graphene.Int(required=True))

    def resolve_settings_listing(self, info, category_id, status, page, per_page):
        instances_to_miss = (page-1) * per_page
        upper_page_limit = page * per_page
        profile = info.context.user.active_profile
        posts = profile.posts.filter(category_id=category_id)
        status = status.lower()

        if status == 'active':
            posts = posts.filter(is_active=True)
        elif status == 'inactive':
            posts = posts.filter(is_active=False)
        else:
            pass

        return ListingList(listing=posts[instances_to_miss: upper_page_limit], num_objects=len(posts), sorry=not bool(len(posts)))

    def resolve_listing(self, info, category_id, looking_for, min_age, max_age, favorite, page, per_page):
        Post.delete_outdated_posts()
        instances_to_miss = (page-1) * per_page
        upper_page_limit = page * per_page

        user = info.context.user
        profile = user.profiles.all().get(is_active=True)
        if favorite:
            posts = profile.favorite_posts.filter(is_matches=False)
            num_objects = len(posts)
            return ListingList(listing=posts[instances_to_miss: upper_page_limit], num_objects=num_objects, sorry=not bool(num_objects))

        disliked_posts = profile.disliked_posts.filter(is_active=True)
        favorite_posts = profile.favorite_posts.filter(is_active=True)
        posts = Post.objects.filter(
            is_matches=False, is_active=True).exclude(profile_id=profile.id)

        if category_id:
            posts = posts.filter(category_id=category_id)

        if looking_for != "Not matter":
            posts = posts.filter(looking_for=looking_for, is_active=True)

        if min_age and max_age:
            if max_age < 55:
                posts = posts.exclude(profile__age__lt=min_age).exclude(
                    profile__age__gt=max_age)
            else:
                posts = posts.exclude(profile__age__lt=min_age)

        for post in disliked_posts:
            if post in posts:
                posts = posts.exclude(id=post.id)

        for post in favorite_posts:
            if post in posts:
                posts = posts.exclude(id=post.id)

        posts = [post for post in posts if post.calculate_distance(
            profile.user.location_point) < RADIUS_FOR_POSTS]

        posts = sorted(posts, key=lambda post: post.date_created, reverse=True)
        num_objects = len(posts)
        return ListingList(listing=posts[instances_to_miss: upper_page_limit], num_objects=num_objects, sorry=not bool(num_objects))

    def resolve_categories(self, info):
        return Category.objects.all()

    def resolve_matches_categories(self, info):
        return Category.objects.filter(use_for_matches=True)

    def resolve_matches(self, info, post_id, liked_me, page, per_page):
        Post.delete_outdated_posts()
        user = info.context.user
        category_id = Post.objects.get(id=post_id).category.id
        profile = user.active_profile
        if category_id not in profile.get_used_categories_ids(is_matches=True):
            return ListingList(listing=[], num_objects=0, has_posts=False, sorry=False, add_post=True)
        exclude_gender = 'Woman' if profile.gender == 'Male' else 'Man'

        disliked_posts = profile.disliked_posts.filter(is_active=True)
        favorite_posts = profile.favorite_posts.filter(is_active=True)

        matches = Post.objects.filter(is_active=True,
                                      category_id=category_id, is_matches=True, min_age__lt=profile.age, max_age__gt=profile.age).exclude(looking_for=exclude_gender).exclude(profile_id=profile.id)

        for match in disliked_posts:
            if match in matches:
                matches = matches.exclude(id=match.id)
        for match in favorite_posts:
            if match in matches:
                matches = matches.exclude(id=match.id)

        matches = [match for match in matches if match.calculate_distance(
            user.location_point) < RADIUS_FOR_POSTS]

        if liked_me:
            liked_me_profiles = [post.liked_by.all()
                                 for post in profile.posts.filter(is_active=True)]
            liked_me_profiles = [
                item for sublist in liked_me_profiles for item in sublist]

            matches = [
                match for match in matches if match.profile in liked_me_profiles]

        instances_to_miss = (page-1) * per_page
        upper_page_limit = page * per_page

        matches = sorted(
            matches, key=lambda match: match.date_created, reverse=True)
        num_objects = len(matches)
        has_posts = bool(num_objects)
        return ListingList(listing=matches[instances_to_miss: upper_page_limit], num_objects=num_objects, has_posts=has_posts, sorry=not has_posts, add_post=False)
