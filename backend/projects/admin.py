from django.contrib import admin
from .models import Project


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "client", "status", "budget", "created_at")
    list_filter = ("status", "category", "created_at")
    search_fields = ("title", "description")
