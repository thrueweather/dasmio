# Generated by Django 3.0.2 on 2020-07-02 12:15

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('photos', '0007_auto_20200702_1210'),
    ]

    operations = [
        migrations.AddField(
            model_name='image',
            name='source',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='gallery_images', to='photos.SourceImage'),
        ),
        migrations.AlterField(
            model_name='avatar',
            name='source',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='avatars', to='photos.SourceImage'),
        ),
        migrations.AlterField(
            model_name='postimage',
            name='source',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='photos.SourceImage'),
        ),
    ]
