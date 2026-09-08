from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from accounts.models import User
from messaging.models import Message
from projects.models import Project


class Command(BaseCommand):
    help = "Create starter users, sample projects, and a demo conversation for SkillBridge."

    def handle(self, *args, **options):
        client, _ = User.objects.get_or_create(
            username="client_demo",
            defaults={
                "email": "client@example.com",
                "password": "password123",
                "firstName": "Client",
                "lastName": "Demo",
                "role": User.Role.CLIENT,
            },
        )
        if not client.has_usable_password():
            client.set_password("password123")
            client.save(update_fields=["password"])

        freelancer, _ = User.objects.get_or_create(
            username="freelancer_demo",
            defaults={
                "email": "freelancer@example.com",
                "password": "password123",
                "firstName": "Freelancer",
                "lastName": "Demo",
                "role": User.Role.FREELANCER,
            },
        )
        if not freelancer.has_usable_password():
            freelancer.set_password("password123")
            freelancer.save(update_fields=["password"])

        project_1, _ = Project.objects.get_or_create(
            title="Website Redesign",
            defaults={
                "description": "Modernize a startup landing page and improve conversion flow.",
                "category": "Web Development",
                "budget": 2500.00,
                "currency": "USD",
                "duration": "3 weeks",
                "skills_required": ["React", "UI/UX", "CSS"],
                "status": Project.Status.OPEN,
                "client": client,
                "freelancer": freelancer,
                "deadline": timezone.now() + timedelta(days=21),
                "attachments": ["brief.pdf"],
            },
        )

        project_2, _ = Project.objects.get_or_create(
            title="Mobile App MVP",
            defaults={
                "description": "Build the MVP for a customer support mobile app.",
                "category": "Mobile Development",
                "budget": 4000.00,
                "currency": "USD",
                "duration": "5 weeks",
                "skills_required": ["React Native", "TypeScript", "API Integration"],
                "status": Project.Status.OPEN,
                "client": client,
                "freelancer": freelancer,
                "deadline": timezone.now() + timedelta(days=30),
                "attachments": ["requirements.txt"],
            },
        )

        Message.objects.get_or_create(
            sender=client,
            recipient=freelancer,
            content="Hi! I would like to discuss the website redesign project.",
        )

        self.stdout.write(
            self.style.SUCCESS(
                f"Seed data created: client={client.email}, freelancer={freelancer.email}, "
                f"projects={project_1.title}, {project_2.title}"
            )
        )
