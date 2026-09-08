from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Message

User = get_user_model()


class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.PrimaryKeyRelatedField(read_only=True)
    recipient = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    class Meta:
        model = Message
        fields = ["id", "sender", "recipient", "content", "read", "created_at"]
        read_only_fields = ["id", "sender", "created_at"]

    def create(self, validated_data):
        validated_data["sender"] = self.context["request"].user
        return super().create(validated_data)
