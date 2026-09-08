from datetime import datetime

import jwt
from django.conf import settings
from rest_framework import generics, filters, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly


from .models import Project
from .serializers import ProjectSerializer


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
        # If Authorization header contains our JWT, extract user_id and set as client
        auth_header = request.headers.get("Authorization") or request.META.get("HTTP_AUTHORIZATION")
        data = request.data.copy()

        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ", 1)[1]
            try:
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
                user_id = payload.get("user_id")
                if user_id and not data.get("client"):
                    data["client"] = user_id
            except Exception:
                # ignore token errors; permission class will handle unauthenticated
                pass

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
