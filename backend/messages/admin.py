from django.contrib import admin
from .models import Message


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'sender', 'recipient', 'created_at', 'read')
    list_filter = ('read', 'created_at')
    search_fields = ('sender__email', 'recipient__email', 'content')
