import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import projectService from "../../services/projectService";
import proposalService from "../../services/proposalService";

import type { Project } from "../../types/project";
import type { Proposal } from "../../services/proposalService";

import "./ClientProjects.css";

function ClientProjects() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Récupérer l'utilisateur connecté
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    const loadProjectsAndProposals = async () => {
      if (!user?.id) {
        setError("Utilisateur non connecté.");
        setIsLoading(false);
        return;
      }

      try {
        // Charger les projets + les proposals en parallèle
        const [allProjects, allProposals] = await Promise.all([
          projectService.getProjects(),
          proposalService.getProposals(),
        ]);

        // Garder uniquement les projets du client connecté
        const clientProjects = allProjects.filter(
          (project) => String(project.client) === String(user.id)
        );

        setProjects(clientProjects);
        setProposals(allProposals);
      } catch (err) {
        console.error("Failed to load client projects:", err);
        setError("Impossible de charger vos projets.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProjectsAndProposals();
  }, [user?.id]);

  // Compter les vraies proposals d'un projet
  const getProjectProposalCount = (projectId: number | string) => {
    return proposals.filter(
      (proposal) => String(proposal.project) === String(projectId)
    ).length;
  };

  const getStatusLabel = (status: Project["status"]) => {
    switch (status) {
      case "open":
        return "Open";
      case "in_progress":
        return "In Progress";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <main className="client-projects-page">
        <div className="client-projects-container">
          <p>Loading your projects...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="client-projects-page">
      <div className="client-projects-container">
        <div className="client-projects-header">
          <div>
            <h1>My Projects</h1>
            <p>Manage the projects you have posted on SkillBridge.</p>
          </div>

          <button
            className="create-project-btn"
            onClick={() => navigate("/dashboard/create-project")}
          >
            + Post a Project
          </button>
        </div>

        {error && <div className="projects-error">{error}</div>}

        {!error && projects.length === 0 && (
          <div className="empty-projects">
            <h2>No projects yet</h2>

            <p>
              You haven't posted any projects yet. Create your first project
              and start receiving proposals.
            </p>

            <button
              className="create-project-btn"
              onClick={() => navigate("/dashboard/create-project")}
            >
              Post Your First Project
            </button>
          </div>
        )}

        {projects.length > 0 && (
          <div className="projects-grid">
            {projects.map((project) => {
              const proposalCount = getProjectProposalCount(project.id);

              return (
                <article
                  className="client-project-card"
                  key={project.id}
                >
                  <div className="project-card-top">
                    <span className="project-category">
                      {project.category || "General"}
                    </span>

                    <span
                      className={`project-status ${project.status}`}
                    >
                      {getStatusLabel(project.status)}
                    </span>
                  </div>

                  <h2>{project.title}</h2>

                  <p className="project-description">
                    {project.description}
                  </p>

                  <div className="project-info">
                    <div>
                      <span>Budget</span>
                      <strong>
                        {project.budget} {project.currency}
                      </strong>
                    </div>

                    <div>
                      <span>Duration</span>
                      <strong>
                        {project.duration || "Not specified"}
                      </strong>
                    </div>
                  </div>

                  <div className="project-skills">
                    {project.skills_required?.map((skill) => (
                      <span key={skill}>{skill}</span>
                    ))}
                  </div>

                  <div className="project-card-footer">
                    <span>
                      {proposalCount} proposal
                      {proposalCount !== 1 ? "s" : ""}
                    </span>

                    <button
                      onClick={() =>
                        navigate(
                          `/dashboard/projects/${project.id}/proposals`
                        )
                      }
                    >
                      View Proposals →
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

export default ClientProjects;