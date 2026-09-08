import jwt
from django.conf import settings
from django.db.models import Q
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Message
from .serializers import MessageSerializer
from .permissions import IsAuthenticatedForMessaging


class MessageListCreateView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only return messages where current user is sender or recipient
        current_user = self.request.user
        other_user = self.request.query_params.get('user')

        if other_user:
            # Get conversation between current user and specific other user
            return Message.objects.filter(
                Q(sender_id=current_user.id, recipient_id=other_user) |
                Q(sender_id=other_user, recipient_id=current_user.id)
            ).order_by('created_at')

        # Return all messages where current user is involved
        return Message.objects.filter(
            Q(sender_id=current_user.id) | Q(recipient_id=current_user.id)
        ).order_by('created_at')

    def perform_create(self, serializer):
        # Sender is set automatically by MessageSerializer using request.user
        serializer.save(sender=self.request.user)
