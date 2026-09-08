from datetime import datetime

from django.conf import settings
from rest_framework import generics, filters, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly


from .models import Project
from .serializers import ProjectSerializer
from .permissions import IsProjectOwner


class ProjectListCreateView(generics.ListCreateAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ["title", "description"]

    def get_queryset(self):
        qs = Project.objects.all().order_by("-created_at")
        category = self.request.query_params.get("category")
        status = self.request.query_params.get("status")
        min_budget = self.request.query_params.get("minBudget")
        max_budget = self.request.query_params.get("maxBudget")
        search = self.request.query_params.get("search")

        if category:
            qs = qs.filter(category__iexact=category)
        if status:
            qs = qs.filter(status=status)
        if min_budget:
            try:
                qs = qs.filter(budget__gte=float(min_budget))
            except ValueError:
                pass
        if max_budget:
            try:
                qs = qs.filter(budget__lte=float(max_budget))
            except ValueError:
                pass
        if search:
            qs = qs.filter(title__icontains=search) | qs.filter(description__icontains=search)

        return qs

    def create(self, request, *args, **kwargs):
        # Use request.user from JWTAuthentication
        data = request.data.copy()
        if request.user and request.user.is_authenticated and not data.get("client"):
            data["client"] = request.user.id

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsProjectOwner]
