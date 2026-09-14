import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import projectService from "../../services/projectService";
import proposalService from "../../services/proposalService";

import type { Project } from "../../types/project";
import type { Proposal } from "../../services/proposalService";

import "./MyProjects.css";

function MyProjects() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    const loadMyProjects = async () => {
      if (!user?.id) {
        setError("Utilisateur non connecté.");
        setIsLoading(false);
        return;
      }

      try {
        const [allProjects, allProposals] = await Promise.all([
          projectService.getProjects(),
          proposalService.getProposals(),
        ]);

        const myProjects = allProjects.filter(
          (project) =>
            project.freelancer !== null &&
            String(project.freelancer) === String(user.id)
        );

        setProjects(myProjects);
        setProposals(allProposals);
      } catch (err) {
        console.error("Failed to load freelancer projects:", err);
        setError("Impossible de charger vos projets.");
      } finally {
        setIsLoading(false);
      }
    };

    loadMyProjects();
  }, [user?.id]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const searchValue = searchTerm.toLowerCase();

      const matchesSearch =
        project.title?.toLowerCase().includes(searchValue) ||
        project.description?.toLowerCase().includes(searchValue) ||
        project.category?.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "all" || project.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [projects, searchTerm, statusFilter]);

  const totalProjects = projects.length;

  const inProgressProjects = projects.filter(
    (project) => project.status === "in_progress"
  ).length;

  const completedProjects = projects.filter(
    (project) => project.status === "completed"
  ).length;

  

  const myProjectIds = new Set(
   projects.map((project) => Number(project.id))
  );

  const acceptedProposals = proposals.filter(
   (proposal) =>
    myProjectIds.has(Number(proposal.project)) &&
    String(proposal.status).toLowerCase() === "accepted"
  ).length;

  const acceptedProposalValue = proposals
   .filter(
     (proposal) =>
       myProjectIds.has(Number(proposal.project)) &&
       String(proposal.status).toLowerCase() === "accepted"
   )
   .reduce(
     (total, proposal) =>
       total + Number(proposal.proposed_budget || 0),
     0
    );

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

  const getProjectSkills = (project: Project) => {
    if (!project.skills_required) {
      return [];
    }

    return project.skills_required;
  };

  if (isLoading) {
    return (
      <main className="my-projects-page">
        <div className="my-projects-container">
          <div className="my-projects-loading">
            <div className="loading-spinner"></div>
            <p>Loading your projects...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="my-projects-page">
      <div className="my-projects-container">

        <div className="my-projects-header">
          <div>
            <span className="page-eyebrow">FREELANCER WORKSPACE</span>

            <h1>My Projects</h1>

            <p>
              Manage the projects assigned to you and track your progress.
            </p>
          </div>
        </div>

        {error && (
          <div className="my-projects-error">
            {error}
          </div>
        )}

        {!error && (
          <>
            <section className="my-projects-stats">

              <div className="project-stat-card">
                <div className="stat-icon">📁</div>

                <div>
                  <span>Total Projects</span>
                  <strong>{totalProjects}</strong>
                </div>
              </div>

              <div className="project-stat-card">
                <div className="stat-icon">⚡</div>

                <div>
                  <span>In Progress</span>
                  <strong>{inProgressProjects}</strong>
                </div>
              </div>

              <div className="project-stat-card">
                <div className="stat-icon">✓</div>

                <div>
                  <span>Completed</span>
                  <strong>{completedProjects}</strong>
                </div>
              </div>

              <div className="project-stat-card">
                <div className="stat-icon">📨</div>

                <div>
                  <span>Accepted Proposals</span>
                  <strong>{acceptedProposalValue}</strong>
                </div>
              </div>

            </section>

            <section className="my-projects-toolbar">

              <div className="projects-search">
                <span>⌕</span>

                <input
                  type="text"
                  placeholder="Search your projects..."
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(event.target.value)
                  }
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
              >
                <option value="all">All statuses</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>

            </section>

            {projects.length === 0 && (
              <div className="my-projects-empty">

                <div className="empty-icon">💼</div>

                <h2>No assigned projects yet</h2>

                <p>
                  You don't have any projects assigned to you yet.
                  Browse the marketplace and submit proposals to find
                  your next project.
                </p>

                <button
                  onClick={() => navigate("/marketplace")}
                >
                  Browse Marketplace →
                </button>

              </div>
            )}

            {projects.length > 0 && filteredProjects.length === 0 && (
              <div className="my-projects-empty">

                <div className="empty-icon">⌕</div>

                <h2>No projects found</h2>

                <p>
                  Try changing your search or status filter.
                </p>

              </div>
            )}

            {filteredProjects.length > 0 && (
              <div className="my-projects-grid">

                {filteredProjects.map((project) => {
                  const skills = getProjectSkills(project);

                  return (
                    <article
                      className="my-project-card"
                      key={project.id}
                    >

                      <div className="my-project-card-top">

                        <span className="my-project-category">
                          {project.category || "General"}
                        </span>

                        <span
                          className={`my-project-status ${project.status}`}
                        >
                          {getStatusLabel(project.status)}
                        </span>

                      </div>

                      <h2>{project.title}</h2>

                      <p className="my-project-description">
                        {project.description}
                      </p>

                      <div className="my-project-info">

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

                      {skills.length > 0 && (
                        <div className="my-project-skills">
                          {skills.map((skill) => (
                            <span key={skill}>
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="my-project-card-footer">

                        <button
                          className="view-project-btn"
                          onClick={() =>
                            navigate(`/marketplace/${project.id}`)
                          }
                        >
                          View Project
                        </button>

                        <button
                          className="message-client-btn"
                          onClick={() =>
                            navigate("/messages")
                          }
                        >
                          Message Client
                        </button>

                      </div>

                    </article>
                  );
                })}

              </div>
            )}
          </>
        )}

      </div>
    </main>
  );
}

export default MyProjects;