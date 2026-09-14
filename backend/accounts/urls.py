from django.urls import path

from .views import (
    LoginView,
    MeView,
    RegisterView,
    UpdatePasswordView,
    UpdateProfileView,
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("me/", MeView.as_view(), name="me"),
    path("profile/", UpdateProfileView.as_view(), name="update-profile"),
    path("password/", UpdatePasswordView.as_view(), name="update-password"),
]
