from django import forms
from django.forms import ModelForm
from django.forms.widgets import TextInput


from chat.models import Message, Room


class MessageForm(ModelForm):
    """ Form for chat messages """
    message_id = forms.IntegerField(required=False)

    class Meta:
        model = Message
        fields = [
            'text', 'sender', 'room', 'message_id', 'seen'
        ]
