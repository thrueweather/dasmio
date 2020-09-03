from django.contrib import admin

from .models import Image, Avatar, PostImage, SourceImage

admin.site.register(Image)
admin.site.register(Avatar)
admin.site.register(PostImage)
admin.site.register(SourceImage)
