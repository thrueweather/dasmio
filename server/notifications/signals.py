import django.dispatch

posts_matched = django.dispatch.Signal(
    providing_args=['matched_post'])


new_like = django.dispatch.Signal(providing_args=['profile'])

new_superlike = django.dispatch.Signal(providing_args=['profile'])

new_listing_response = django.dispatch.Signal(providing_args=['profile'])
