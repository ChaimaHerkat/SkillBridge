from datetime import datetime, timedelta

import jwt
from django.conf import settings
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import User
from .serializers import RegisterSerializer


def _generate_jwt_for_user(user: User) -> str:
    exp = datetime.utcnow() + timedelta(days=7)
    payload = {"user_id": user.id, "exp": exp}
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")
    # jwt.encode returns bytes on some PyJWT versions; ensure str
    if isinstance(token, bytes):
        token = token.decode("utf-8")
    return token


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()

            return Response(
                {
                    "message": "User created successfully",
                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "firstName": user.firstName,
                        "lastName": user.lastName,
                        "email": user.email,
                        "role": user.role,
                    },
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email") or request.data.get("username")
        password = request.data.get("password")

        if not email or not password:
            return Response(
                {"detail": "Email/username and password required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Look up user by email first, then by username (email is used as username on register)
        user = (
            User.objects.filter(email=email).first()
            or User.objects.filter(username=email).first()
        )

        if user is None or not user.is_active:
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        # Use check_password() directly — avoids Django auth-backend overhead
        # and works correctly with our custom User model.
        if not user.check_password(password):
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        token = _generate_jwt_for_user(user)

        return Response(
            {
                "token": token,
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "firstName": user.firstName,
                    "lastName": user.lastName,
                    "email": user.email,
                    "role": user.role,
                },
            }
        )


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Use request.user which is already populated by JWTAuthentication
        user = request.user
        return Response(
            {
                "id": user.id,
                "username": user.username,
                "firstName": user.firstName,
                "lastName": user.lastName,
                "email": user.email,
                "role": user.role,
            }
        )
