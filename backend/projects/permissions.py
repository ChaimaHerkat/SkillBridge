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
    """Allow everyone to view projects, but only CLIENT users to create them."""

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True

        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == "CLIENT"
        )


class IsFreelancer(permissions.BasePermission):
    """Allow access only to authenticated freelancers."""

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == "FREELANCER"
        )


class CanAccessProposal(permissions.BasePermission):
    """
    Allow a freelancer to access their own proposal
    and a client to access proposals belonging to their projects.
    """

    def has_object_permission(self, request, view, obj):
        if not request.user or not request.user.is_authenticated:
            return False

        if request.user.role == "FREELANCER":
            return obj.freelancer_id == request.user.id

        if request.user.role == "CLIENT":
            return obj.project.client_id == request.user.id

        return False