"""server URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path
from django.conf.urls import url
from django.views.decorators.csrf import csrf_exempt
from graphene_django.views import GraphQLView
from graphene_file_upload.django import FileUploadGraphQLView
from channels.routing import ProtocolTypeRouter, URLRouter
from server.channels import GraphQLSubscriptionConsumer
from server.token_auth import TokenAuthMiddleware


urlpatterns = [
    path("admin/", admin.site.urls),
    # path("graphql/", csrf_exempt(GraphQLView.as_view(graphiql=True))),
    url(r'^graphql', csrf_exempt(FileUploadGraphQLView.as_view(graphiql=True))),
    path("gql/", csrf_exempt(GraphQLView.as_view(batch=True))),
]


urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

application = ProtocolTypeRouter({
    "websocket": TokenAuthMiddleware(
        URLRouter([
            path('subscriptions', GraphQLSubscriptionConsumer)
        ]),
    ),
})


############


# from graphene_django.views import GraphQLView

# from server.token_auth import TokenAuthMiddleware
# from server.channels import GraphQLSubscriptionConsumer

# from channels.routing import ProtocolTypeRouter, URLRouter
# from channels.http import AsgiHandler
# from channels.auth import AuthMiddlewareStack

# from django.conf import settings
# from django.conf.urls.static import static
# from django.contrib import admin
# from django.urls import path
# from django.views.decorators.csrf import csrf_exempt


# urlpatterns = [
#     path('admin/', admin.site.urls),
#     path('graphql/', csrf_exempt(GraphQLView.as_view(graphiql=True))),
#     path('gql/', csrf_exempt(GraphQLView.as_view(batch=True))),
# ]

# urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
# urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# application = ProtocolTypeRouter({
#     "websocket": TokenAuthMiddleware(
#         URLRouter([
#             path('subscriptions', GraphQLSubscriptionConsumer)
#         ]),
#     ),
# })
