# Generated by Django 3.0.2 on 2020-07-02 12:10

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('photos', '0006_source'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Source',
            new_name='SourceImage',
        ),
    ]
