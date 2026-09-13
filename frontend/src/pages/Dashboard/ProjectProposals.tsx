import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import projectService from "../../services/projectService";
import proposalService, {
  type Proposal,
} from "../../services/proposalService";

import type { Project } from "../../types/project";

import "./ProjectProposals.css";

function ProjectProposals() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [project, setProject] = useState<Project | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadData = async () => {
      if (!id) {
        setError("Project not found.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        const [projectData, proposalsData] = await Promise.all([
          projectService.getProjectById(id),
          proposalService.getProposals(),
        ]);

        setProject(projectData);

        const projectProposals = proposalsData.filter(
          (proposal) => String(proposal.project) === String(id)
        );

        setProposals(projectProposals);
      } catch (err) {
        console.error("Failed to load project proposals:", err);
        setError("Unable to load project proposals.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleAccept = async (proposalId: number) => {
    try {
      setActionLoading(proposalId);
      setError("");
      setSuccess("");

      const updatedProposal =
        await proposalService.acceptProposal(proposalId);

      setProposals((currentProposals) =>
        currentProposals.map((proposal) =>
          proposal.id === proposalId
            ? updatedProposal
            : {
                ...proposal,
                status:
                  proposal.status === "pending"
                    ? "rejected"
                    : proposal.status,
              }
        )
      );

      setProject((currentProject) =>
        currentProject
          ? {
              ...currentProject,
              status: "in_progress",
              freelancer: updatedProposal.freelancer,
            }
          : currentProject
      );

      setSuccess(
        "Proposal accepted successfully. The project is now in progress."
      );
    } catch (err) {
      console.error("Failed to accept proposal:", err);
      setError("Unable to accept this proposal.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (proposalId: number) => {
    try {
      setActionLoading(proposalId);
      setError("");
      setSuccess("");

      const updatedProposal =
        await proposalService.rejectProposal(proposalId);

      setProposals((currentProposals) =>
        currentProposals.map((proposal) =>
          proposal.id === proposalId
            ? updatedProposal
            : proposal
        )
      );

      setSuccess("Proposal rejected.");
    } catch (err) {
      console.error("Failed to reject proposal:", err);
      setError("Unable to reject this proposal.");
    } finally {
      setActionLoading(null);
    }
  };

  if (isLoading) {
    return (
      <main className="project-proposals-page">
        <div className="project-proposals-container">
          <p>Loading proposals...</p>
        </div>
      </main>
    );
  }

  if (error && !project) {
    return (
      <main className="project-proposals-page">
        <div className="project-proposals-container">
          <div className="proposals-error">{error}</div>

          <button
            className="back-projects-button"
            onClick={() => navigate("/dashboard/projects")}
          >
            ← Back to My Projects
          </button>
        </div>
      </main>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <main className="project-proposals-page">
      <div className="project-proposals-container">

        <button
          className="back-projects-button"
          onClick={() => navigate("/dashboard/projects")}
        >
          ← Back to My Projects
        </button>

        <header className="proposals-header">
          <div>
            <span className="proposals-label">PROJECT PROPOSALS</span>

            <h1>{project.title}</h1>

            <p>
              Review freelancers who have submitted proposals
              for this project.
            </p>
          </div>

          <div className="proposal-count">
            <strong>{proposals.length}</strong>
            <span>
              {proposals.length === 1
                ? "Proposal"
                : "Proposals"}
            </span>
          </div>
        </header>

        {error && (
          <div className="proposals-error">
            {error}
          </div>
        )}

        {success && (
          <div className="proposals-success">
            {success}
          </div>
        )}

        {proposals.length === 0 ? (
          <section className="empty-proposals">
            <div className="empty-icon">📩</div>

            <h2>No proposals yet</h2>

            <p>
              Freelancers have not submitted any proposals
              for this project yet.
            </p>
          </section>
        ) : (
          <section className="proposals-list">
            {proposals.map((proposal) => (
              <article
                className="proposal-card"
                key={proposal.id}
              >
                <div className="proposal-card-header">
                  <div className="freelancer-info">
                    <div className="freelancer-avatar">
                      {proposal.freelancer_name
                        ?.charAt(0)
                        .toUpperCase() || "F"}
                    </div>

                    <div>
                      <h2>
                        {proposal.freelancer_name ||
                          "Freelancer"}
                      </h2>

                      <span>
                        Proposal #{proposal.id}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`proposal-status ${proposal.status}`}
                  >
                    {proposal.status}
                  </span>
                </div>

                <div className="proposal-details">
                  <div>
                    <span>Proposed Budget</span>
                    <strong>
                      {proposal.proposed_budget} USD
                    </strong>
                  </div>

                  <div>
                    <span>Delivery Time</span>
                    <strong>
                      {proposal.delivery_time}
                    </strong>
                  </div>
                </div>

                <div className="cover-letter">
                  <span>Cover Letter</span>

                  <p>{proposal.cover_letter}</p>
                </div>

                {proposal.status === "pending" && (
                  <div className="proposal-actions">
                    <button
                      className="reject-proposal-button"
                      disabled={actionLoading === proposal.id}
                      onClick={() =>
                        handleReject(proposal.id)
                      }
                    >
                      {actionLoading === proposal.id
                        ? "Processing..."
                        : "Reject"}
                    </button>

                    <button
                      className="accept-proposal-button"
                      disabled={actionLoading === proposal.id}
                      onClick={() =>
                        handleAccept(proposal.id)
                      }
                    >
                      {actionLoading === proposal.id
                        ? "Processing..."
                        : "Accept Proposal"}
                    </button>
                  </div>
                )}
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

export default ProjectProposals;

