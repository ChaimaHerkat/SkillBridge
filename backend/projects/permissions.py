from rest_framework import permissions


class IsProjectOwner(permissions.BasePermission):
    """Permission to check if user is the project owner (client)"""

    def has_object_permission(self, request, view, obj):
        # Allow GET requests (read-only)
        if request.method in permissions.SAFE_METHODS:
            return True
        # For PUT, PATCH, DELETE - only project owner can modify
        return obj.client_id == request.user.id


class IsClientOrReadOnly(permissions.BasePermission):
    """Permission to allow anyone to view, but only authenticated clients to create"""

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated
