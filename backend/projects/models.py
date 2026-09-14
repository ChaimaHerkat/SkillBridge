from django.conf import settings
from django.db import models


class Project(models.Model):
    class Status(models.TextChoices):
        OPEN = "open", "Open"
        IN_PROGRESS = "in_progress", "In Progress"
        COMPLETED = "completed", "Completed"
        CANCELLED = "cancelled", "Cancelled"

    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=100, blank=True, default="")
    budget = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    currency = models.CharField(max_length=10, default="USD")
    duration = models.CharField(max_length=50, blank=True, default="")
    skills_required = models.JSONField(default=list, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.OPEN)
    client = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="client_projects",
        on_delete=models.CASCADE,
    )
    freelancer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="freelancer_projects",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
    )
    applicants = models.JSONField(default=list, blank=True)
    deadline = models.DateTimeField(null=True, blank=True)
    attachments = models.JSONField(default=list, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class Proposal(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        ACCEPTED = "accepted", "Accepted"
        REJECTED = "rejected", "Rejected"
        WITHDRAWN = "withdrawn", "Withdrawn"

    project = models.ForeignKey(
        Project,
        related_name="proposals",
        on_delete=models.CASCADE,
    )

    freelancer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="proposals",
        on_delete=models.CASCADE,
    )

    cover_letter = models.TextField()

    proposed_budget = models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

    delivery_time = models.CharField(max_length=50)

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.freelancer} → {self.project.title}"
