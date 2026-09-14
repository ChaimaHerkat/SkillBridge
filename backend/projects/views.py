from rest_framework import filters, generics, status
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response

from .models import Project, Proposal
from .permissions import (
    CanAccessProposal,
    IsClientOrReadOnly,
    IsFreelancer,
    IsProjectOwner,
)
from .serializers import ProjectSerializer, ProposalSerializer


class ProjectListCreateView(generics.ListCreateAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [IsClientOrReadOnly]
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

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
            headers=headers,
        )


class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [
        IsAuthenticatedOrReadOnly,
        IsProjectOwner,
    ]


class ProposalListCreateView(generics.ListCreateAPIView):
    serializer_class = ProposalSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [
                IsAuthenticated(),
                IsFreelancer(),
            ]

        return [IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user

        if user.role == "FREELANCER":
            return Proposal.objects.filter(freelancer=user).select_related(
                "project",
                "freelancer",
            )

        if user.role == "CLIENT":
            return Proposal.objects.filter(project__client=user).select_related(
                "project",
                "freelancer",
            )

        return Proposal.objects.none()

    def perform_create(self, serializer):
        project = serializer.validated_data["project"]
        freelancer = self.request.user

        # A freelancer cannot submit a proposal
        # to their own project.
        if project.client_id == freelancer.id:
            raise ValidationError(
                {"project": ("You cannot submit a proposal " "to your own project.")}
            )

        # Prevent multiple pending proposals
        # from the same freelancer for the same project.
        existing_proposal = Proposal.objects.filter(
            project=project,
            freelancer=freelancer,
            status=Proposal.Status.PENDING,
        ).exists()

        if existing_proposal:
            raise ValidationError(
                {"project": ("You already have a pending proposal " "for this project.")}
            )

        serializer.save(freelancer=freelancer)


class ProposalDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProposalSerializer
    permission_classes = [
        IsAuthenticated,
        CanAccessProposal,
    ]

    def get_queryset(self):
        return Proposal.objects.select_related(
            "project",
            "freelancer",
        )


class ProposalAcceptView(generics.GenericAPIView):
    serializer_class = ProposalSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            proposal = Proposal.objects.select_related(
                "project",
                "freelancer",
            ).get(pk=pk)
        except Proposal.DoesNotExist:
            return Response(
                {"detail": "Proposal not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Only the project owner (client) can accept a proposal.
        if request.user.role != "CLIENT" or proposal.project.client_id != request.user.id:
            return Response(
                {"detail": "You do not have permission to accept this proposal."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Only pending proposals can be accepted.
        if proposal.status != Proposal.Status.PENDING:
            return Response(
                {"detail": "Only pending proposals can be accepted."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Accept this proposal.
        proposal.status = Proposal.Status.ACCEPTED
        proposal.save(update_fields=["status", "updated_at"])

        # Assign the freelancer to the project.
        project = proposal.project
        project.freelancer = proposal.freelancer
        project.status = Project.Status.IN_PROGRESS
        project.save(update_fields=["freelancer", "status", "updated_at"])

        # Reject all other pending proposals for this project.
        Proposal.objects.filter(
            project=project,
            status=Proposal.Status.PENDING,
        ).exclude(id=proposal.id).update(
            status=Proposal.Status.REJECTED,
        )

        return Response(
            ProposalSerializer(proposal).data,
            status=status.HTTP_200_OK,
        )


class ProposalRejectView(generics.GenericAPIView):
    serializer_class = ProposalSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            proposal = Proposal.objects.select_related(
                "project",
                "freelancer",
            ).get(pk=pk)
        except Proposal.DoesNotExist:
            return Response(
                {"detail": "Proposal not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Only the project owner (client) can reject a proposal.
        if request.user.role != "CLIENT" or proposal.project.client_id != request.user.id:
            return Response(
                {"detail": "You do not have permission to reject this proposal."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Only pending proposals can be rejected.
        if proposal.status != Proposal.Status.PENDING:
            return Response(
                {"detail": "Only pending proposals can be rejected."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        proposal.status = Proposal.Status.REJECTED
        proposal.save(update_fields=["status", "updated_at"])

        return Response(
            ProposalSerializer(proposal).data,
            status=status.HTTP_200_OK,
        )
