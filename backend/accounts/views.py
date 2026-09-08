from datetime import timedelta, datetime

import jwt
from django.conf import settings
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import RegisterSerializer
from .models import User


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
            return Response({"detail": "Email/username and password required"}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.filter(email=email).first() or User.objects.filter(username=email).first()

        if user is None:
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        authenticated_user = authenticate(request, username=user.username, password=password)
        if authenticated_user is None:
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        token = _generate_jwt_for_user(authenticated_user)

        return Response(
            {
                "token": token,
                "user": {
                    "id": authenticated_user.id,
                    "username": authenticated_user.username,
                    "firstName": authenticated_user.firstName,
                    "lastName": authenticated_user.lastName,
                    "email": authenticated_user.email,
                    "role": authenticated_user.role,
                },
            }
        )


class MeView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        auth_header = request.headers.get("Authorization") or request.META.get("HTTP_AUTHORIZATION")

        if not auth_header or not auth_header.startswith("Bearer "):
            return Response({"detail": "Authorization header required"}, status=status.HTTP_401_UNAUTHORIZED)

        token = auth_header.split(" ", 1)[1]

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            return Response({"detail": "Token expired"}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({"detail": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)

        user_id = payload.get("user_id")
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)

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