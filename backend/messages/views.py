import jwt
from django.conf import settings
from django.db.models import Q
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response

from .models import Message
from .serializers import MessageSerializer


class MessageListCreateView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        # conversation between current user and other user (query param `user`)
        auth_header = self.request.headers.get(
            "Authorization"
        ) or self.request.META.get("HTTP_AUTHORIZATION")
        current_user_id = None
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ", 1)[1]
            try:
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
                current_user_id = payload.get("user_id")
            except Exception:
                current_user_id = None

        other_user = self.request.query_params.get("user")

        if current_user_id and other_user:
            return Message.objects.filter(
                Q(sender_id=current_user_id, recipient_id=other_user)
                | Q(sender_id=other_user, recipient_id=current_user_id)
            ).order_by("created_at")

        if current_user_id:
            # return messages where current user is sender or recipient
            return Message.objects.filter(
                Q(sender_id=current_user_id) | Q(recipient_id=current_user_id)
            ).order_by("created_at")

        return Message.objects.none()

    def create(self, request, *args, **kwargs):
        auth_header = self.request.headers.get(
            "Authorization"
        ) or self.request.META.get("HTTP_AUTHORIZATION")
        if not auth_header or not auth_header.startswith("Bearer "):
            return Response(
                {"detail": "Authentication required"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        token = auth_header.split(" ", 1)[1]
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            current_user_id = payload.get("user_id")
        except Exception:
            return Response(
                {"detail": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED
            )

        data = request.data.copy()
        data["sender"] = current_user_id

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )
