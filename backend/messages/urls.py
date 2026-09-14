from django.urls import path

from .views import (
    ConversationListView,
    MarkConversationReadView,
    MessageListCreateView,
    UserSearchView,
)

urlpatterns = [
    path(
        "",
        MessageListCreateView.as_view(),
        name="messages_list_create",
    ),
    path(
        "conversations/",
        ConversationListView.as_view(),
        name="conversations",
    ),
    path(
        "users/search/",
        UserSearchView.as_view(),
        name="users_search",
    ),
    path(
        "conversations/<int:user_id>/read/",
        MarkConversationReadView.as_view(),
        name="mark_conversation_read",
    ),
]
