import uuid

import requests

from photos.models import Image


def update_user_social_data(strategy, *args, **kwargs):
    """Set the name and avatar for a user only if is new.
    """
    if not kwargs['is_new']:
        return

    full_name = ''
    user = kwargs['user']
    full_name = kwargs['response'].get('name')
    user.full_name = full_name

    user.save()


def social_user(backend, uid, user=None, *args, **kwargs):
    provider = backend.name
    social = backend.strategy.storage.user.get_social_auth(provider, uid)
    if social:
        user = social.user
    return {'social': social,
            'user': user,
            'is_new': user is None,
            'new_association': social is None}


def get_avatar(backend, strategy, details, response,
               user=None, *args, **kwargs):
    if not kwargs['is_new']:
        return None
    url = None

    if backend.name == 'facebook':
        url = "http://graph.facebook.com/%s/picture?type=large" % response['id']

    if backend.name == 'google-oauth2':
        url = response['picture']  # .get('url')

    if url:
        filename = str(uuid.uuid1())
        r = requests.get(url, allow_redirects=True)

        open("server/media/gallery/%s.png" % filename, 'wb').write(r.content)
        Image.objects.create(user=user, image="gallery/%s.png" % filename)
        user.save()
