from django.urls import path

from .views import (
    ProjectListCreateView,
    ProjectDetailView,
    ProposalListCreateView,
    ProposalDetailView,
    ProposalAcceptView,
    ProposalRejectView,
)


urlpatterns = [
    path("", ProjectListCreateView.as_view(), name="projects_list_create"),
    
    path("<int:pk>/", ProjectDetailView.as_view(), name="project_detail"),

    path(
        "proposals/",
        ProposalListCreateView.as_view(),
        name="proposals_list_create",
    ),
    
    path(
        "proposals/<int:pk>/",
        ProposalDetailView.as_view(),
        name="proposal_detail",
    ),
    
    path(
    "proposals/<int:pk>/accept/",
    ProposalAcceptView.as_view(),
    ),
    
    path(
    "proposals/<int:pk>/reject/",
    ProposalRejectView.as_view(),
    ),
]