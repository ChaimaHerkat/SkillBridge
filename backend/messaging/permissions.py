from rest_framework import permissions


class IsMessageParticipant(permissions.BasePermission):
    """Permission to check if user is sender or recipient of message"""

    def has_object_permission(self, request, view, obj):
        # User can only view/modify their own messages
        return obj.sender_id == request.user.id or obj.recipient_id == request.user.id


class IsAuthenticatedForMessaging(permissions.BasePermission):
    """Only authenticated users can access messaging"""

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated
