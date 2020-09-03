from django.contrib.auth import get_user_model
from django.db import models


class Room(models.Model):
    """ Model for Chat Room """
    users = models.ManyToManyField("accounts.Profile", related_name='rooms')
    last_message = models.ForeignKey(
        'Message',
        related_name='last_message',
        blank=True,
        null=True,
        on_delete=models.SET_NULL
    )
    typing = models.BooleanField(default=False)
    post = models.ForeignKey(
        'posts.Post', null=True, blank=True, related_name="rooms", on_delete=models.CASCADE)
    waiting_for_approve = models.BooleanField(default=True)

    def __str__(self):
        return "%s" % (self.id)

    @classmethod
    def exists(cls, user_id_1, user_id_2, post_id):
        """ Method that checks if room exists with provided users """
        if Room.objects.filter(users__id=user_id_1).filter(users__id=user_id_2).filter(post_id=post_id).count() > 0:
            return True
        return False

    @classmethod
    def get_by_users(cls, user_id_1, user_id_2):
        """ Method that gets room by user's id """
        return Room.objects.filter(users__id=user_id_1).filter(users__id=user_id_2).first()


class Message(models.Model):
    """ Model for Chat Message """
    text = models.CharField(max_length=255, null=True, blank=True)
    sender = models.ForeignKey(
        "accounts.Profile",
        related_name='sended_messages',
        null=True,
        on_delete=models.SET_NULL
    )
    room = models.ForeignKey(
        Room,
        related_name='messages',
        null=True,
        on_delete=models.SET_NULL
    )
    seen = models.BooleanField(default=True)
    time = models.DateTimeField(auto_now=True)
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return "Message № " + str(self.pk)
