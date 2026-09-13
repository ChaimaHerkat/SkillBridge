from rest_framework import serializers

from .models import Project, Proposal


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


class ProposalSerializer(serializers.ModelSerializer):
    freelancer_name = serializers.SerializerMethodField()
    project_title = serializers.CharField(
        source="project.title",
        read_only=True,
    )

    class Meta:
        model = Proposal

        fields = [
            "id",
            "project",
            "project_title",
            "freelancer",
            "freelancer_name",
            "cover_letter",
            "proposed_budget",
            "delivery_time",
            "status",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "freelancer",
            "freelancer_name",
            "project_title",
            "status",
            "created_at",
            "updated_at",
        ]

    def get_freelancer_name(self, obj):
        return f"{obj.freelancer.firstName} {obj.freelancer.lastName}".strip()