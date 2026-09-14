import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from django.db.models import Q
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Message
from .serializers import MessageSerializer

User = get_user_model()


def get_current_user_id(request):
    auth_header = request.headers.get("Authorization")

    print("AUTH HEADER:", auth_header)

    if not auth_header or not auth_header.startswith("Bearer "):
        print("NO BEARER TOKEN")
        return None

    token = auth_header.split(" ", 1)[1].strip()

    if not token:
        print("EMPTY TOKEN")
        return None

    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=["HS256"],
        )

        print("JWT PAYLOAD:", payload)

        user_id = (
            payload.get("user_id")
            or payload.get("userId")
            or payload.get("id")
            or payload.get("user")
        )

        print("EXTRACTED USER ID:", user_id)

        if user_id is None:
            return None

        return int(user_id)

    except Exception as e:
        print("JWT ERROR:", repr(e))
        return None


class MessageListCreateView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        current_user_id = get_current_user_id(self.request)

        if not current_user_id:
            return Message.objects.none()

        other_user = self.request.query_params.get("user")

        if other_user:
            return Message.objects.filter(
                Q(
                    sender_id=current_user_id,
                    recipient_id=other_user,
                )
                | Q(
                    sender_id=other_user,
                    recipient_id=current_user_id,
                )
            ).order_by("created_at")

        return Message.objects.filter(
            Q(sender_id=current_user_id) | Q(recipient_id=current_user_id)
        ).order_by("created_at")

    def create(self, request, *args, **kwargs):
        print("🔥 CREATE MESSAGE CALLED")
        print("REQUEST DATA:", request.data)
        print("AUTHORIZATION:", request.headers.get("Authorization"))

        current_user_id = get_current_user_id(request)

        if not current_user_id:
            return Response(
                {"detail": "Authentication required"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        data = request.data.copy()

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)

        if int(data["recipient"]) == int(current_user_id):
            return Response(
                {"detail": "You cannot send a message to yourself."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer.save(sender_id=current_user_id)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
        )


class ConversationListView(APIView):
    """
    Return all real conversations of the authenticated user.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        current_user_id = get_current_user_id(request)

        if not current_user_id:
            return Response(
                {"detail": "Authentication required"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        messages = (
            Message.objects.filter(Q(sender_id=current_user_id) | Q(recipient_id=current_user_id))
            .select_related("sender", "recipient")
            .order_by("-created_at")
        )

        conversations = {}

        # Keep only the latest message for each conversation.
        for message in messages:
            if message.sender_id == current_user_id:
                other_user = message.recipient
            else:
                other_user = message.sender

            if other_user.id not in conversations:
                conversations[other_user.id] = message

        result = []

        for other_user_id, last_message in conversations.items():

            if last_message.sender_id == current_user_id:
                other_user = last_message.recipient
            else:
                other_user = last_message.sender

            unread_count = Message.objects.filter(
                sender_id=other_user_id,
                recipient_id=current_user_id,
                read=False,
            ).count()

            print("UNREAD COUNT:", unread_count)

            first_name = getattr(other_user, "firstName", None)
            if first_name is None:
                first_name = getattr(other_user, "first_name", "")

            last_name = getattr(other_user, "lastName", None)
            if last_name is None:
                last_name = getattr(other_user, "last_name", "")

            email = getattr(other_user, "email", "")
            role = getattr(other_user, "role", "")

            result.append(
                {
                    "user": {
                        "id": other_user.id,
                        "firstName": first_name or "",
                        "lastName": last_name or "",
                        "email": email or "",
                        "role": role or "",
                    },
                    "last_message": {
                        "id": last_message.id,
                        "content": last_message.content,
                        "sender": last_message.sender_id,
                        "recipient": last_message.recipient_id,
                        "created_at": last_message.created_at,
                        "read": last_message.read,
                    },
                    "unread_count": unread_count,
                }
            )

        return Response(result)


class MarkConversationReadView(APIView):
    """
    Mark all incoming messages from one user as read.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request, user_id):
        current_user_id = get_current_user_id(request)

        if not current_user_id:
            return Response(
                {"detail": "Authentication required"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        updated_count = Message.objects.filter(
            sender_id=user_id,
            recipient_id=current_user_id,
            read=False,
        ).update(read=True)

        return Response(
            {
                "detail": "Conversation marked as read.",
                "updated_count": updated_count,
            },
            status=status.HTTP_200_OK,
        )


class UserSearchView(APIView):
    """
    Search clients and freelancers to start a new conversation.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        current_user_id = get_current_user_id(request)

        if not current_user_id:
            return Response(
                {"detail": "Authentication required"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        query = request.query_params.get("q", "").strip()

        print("SEARCH QUERY:", query)
        print("CURRENT USER ID:", current_user_id)
        print(
            "ALL USERS:", list(User.objects.values("id", "firstName", "lastName", "email", "role"))
        )

        if not query:
            return Response([])

        users = (
            User.objects.exclude(id=current_user_id)
            .filter(
                Q(firstName__icontains=query)
                | Q(lastName__icontains=query)
                | Q(email__icontains=query)
                | Q(role__icontains=query)
            )
            .order_by("firstName", "lastName")[:10]
        )

        print("SEARCH RESULTS:", list(users.values("id", "firstName", "lastName", "email", "role")))

        result = []

        for person in users:
            result.append(
                {
                    "id": person.id,
                    "firstName": getattr(person, "firstName", "") or "",
                    "lastName": getattr(person, "lastName", "") or "",
                    "email": getattr(person, "email", "") or "",
                    "role": getattr(person, "role", "") or "",
                }
            )

        return Response(result)
