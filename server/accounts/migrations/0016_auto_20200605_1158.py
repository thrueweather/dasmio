# Generated by Django 3.0.2 on 2020-06-05 11:58

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('photos', '0003_avatar'),
        ('accounts', '0015_auto_20200527_1324'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='avatar',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='photos.Avatar'),
        ),
    ]
