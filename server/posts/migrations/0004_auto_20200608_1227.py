# Generated by Django 3.0.2 on 2020-06-08 12:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0003_auto_20200528_1523'),
    ]

    operations = [
        migrations.AddField(
            model_name='category',
            name='use_for_matches',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='post',
            name='is_matches',
            field=models.BooleanField(default=False),
        ),
    ]
