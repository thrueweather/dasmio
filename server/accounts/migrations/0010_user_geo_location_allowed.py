# Generated by Django 3.0.2 on 2020-05-18 11:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0009_profile_is_active'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='geo_location_allowed',
            field=models.BooleanField(default=False),
        ),
    ]
