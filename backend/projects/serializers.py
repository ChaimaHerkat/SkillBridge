from rest_framework import serializers

from .models import Project


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = [
            "id",
            "title",
            "description",
            "category",
            "budget",
            "currency",
            "duration",
            "skills_required",
            "status",
            "client",
            "freelancer",
            "applicants",
            "created_at",
            "updated_at",
            "deadline",
            "attachments",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
