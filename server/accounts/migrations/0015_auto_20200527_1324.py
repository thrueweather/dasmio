# Generated by Django 3.0.2 on 2020-05-27 13:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0014_auto_20200525_1144'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='profile',
            name='latitude',
        ),
        migrations.RemoveField(
            model_name='profile',
            name='longitude',
        ),
        migrations.AddField(
            model_name='user',
            name='latitude',
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AddField(
            model_name='user',
            name='longitude',
            field=models.CharField(blank=True, max_length=255),
        ),
    ]
