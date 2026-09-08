from rest_framework import serializers
from .models import Message


class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Message
        fields = ["id", "sender", "recipient", "content", "read", "created_at"]
        read_only_fields = ["id", "sender", "created_at"]
