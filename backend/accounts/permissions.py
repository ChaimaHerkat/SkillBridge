from rest_framework import permissions


class IsAuthenticated(permissions.IsAuthenticated):
    """Custom IsAuthenticated permission class for clarity"""

    pass
