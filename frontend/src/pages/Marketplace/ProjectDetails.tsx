import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import useProjects from "../../hooks/useProjects";
import type { Project } from "../../types/project";
import { useAuth } from "../../context/AuthContext";
import "./ProjectDetails.css";

const ProjectDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { user } = useAuth();
  const { projects, isLoading, error } = useProjects();

  const project = (projects || []).find(
    (item: Project) => String((item as any).id) === String(id)
  );

  /* =========================================================
     LOADING
     ========================================================= */

  if (isLoading) {
    return (
      <main className="project-details-page">
        <section className="project-details-hero">
          <div className="project-details-container">
            <button
              className="back-button"
              onClick={() => navigate("/marketplace")}
            >
              <span>←</span>
              Back to Marketplace
            </button>

            <div className="project-details-state">
              <div className="state-loader" />

              <h2>Loading project...</h2>

              <p>
                We are loading the project details.
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  /* =========================================================
     ERROR
     ========================================================= */

  if (error) {
    return (
      <main className="project-details-page">
        <section className="project-details-hero">
          <div className="project-details-container">
            <button
              className="back-button"
              onClick={() => navigate("/marketplace")}
            >
              <span>←</span>
              Back to Marketplace
            </button>

            <div className="project-details-state error-state">
              <div className="state-icon">!</div>

              <h2>Unable to load project</h2>

              <p>
                {error.message || "Something went wrong."}
              </p>

              <button
                className="state-back-button"
                onClick={() => navigate("/marketplace")}
              >
                Back to Marketplace
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  /* =========================================================
     PROJECT NOT FOUND
     ========================================================= */

  if (!project) {
    return (
      <main className="project-details-page">
        <section className="project-details-hero">
          <div className="project-details-container">
            <button
              className="back-button"
              onClick={() => navigate("/marketplace")}
            >
              <span>←</span>
              Back to Marketplace
            </button>

            <div className="project-details-state">
              <div className="state-icon">?</div>

              <h2>Project not found</h2>

              <p>
                This project may have been removed or is no longer
                available.
              </p>

              <button
                className="state-back-button"
                onClick={() => navigate("/marketplace")}
              >
                Browse Projects
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  /* =========================================================
     REAL PROJECT DATA
     ========================================================= */

  const item = project as any;

  const title =
    item.title ||
    item.name ||
    "Untitled project";

  const description =
    item.description ||
    item.desc ||
    "No description provided.";

  const category =
    item.category ||
    item.category_name ||
    "General";

  const budgetRaw =
    item.budget ??
    item.budget_amount ??
    0;

  const budget = Number(budgetRaw);

  const currency =
    item.currency ||
    item.currency_code ||
    "USD";

  const duration =
    item.duration ||
    item.timeframe ||
    "Flexible";

  const skills =
    Array.isArray(item.skills_required)
      ? item.skills_required
      : Array.isArray(item.skills)
        ? item.skills
        : typeof item.skills_required === "string"
          ? item.skills_required
              .split(",")
              .map((skill: string) => skill.trim())
              .filter(Boolean)
          : [];

  const projectId =
    item.id ||
    item.pk ||
    item.project_id ||
    id;

  /* =========================================================
     PROJECT STATUS
     ========================================================= */

  const projectStatus =
    item.status === "in_progress"
      ? "In Progress"
      : item.status === "completed"
        ? "Completed"
        : item.status === "cancelled"
          ? "Cancelled"
          : "Open";

  /* =========================================================
     SEND PROPOSAL
     ========================================================= */

  const handleSendProposal = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "FREELANCER") {
      return;
    }

    navigate(`/marketplace/${project.id}/proposal`);
  };

  return (
    <main className="project-details-page">
      <section className="project-details-hero">
        <div className="project-details-container">

          {/* =================================================
              BACK
              ================================================= */}

          <button
            className="back-button"
            onClick={() => navigate("/marketplace")}
          >
            <span>←</span>
            Back to Marketplace
          </button>

          <div className="project-details-layout">

            {/* =================================================
                MAIN CARD
                ================================================= */}

            <article className="project-main-card">

              <div className="project-details-top">

                <span className="project-details-category">
                  {category}
                </span>

                <span className="project-details-status">
                  <span className="status-dot" />
                  {projectStatus}
                </span>

              </div>

              <h1>{title}</h1>

              <p className="project-details-description">
                {description}
              </p>

              {/* =================================================
                  OVERVIEW
                  ================================================= */}

              <div className="project-overview">

                <div>
                  <span>Budget</span>

                  <strong>
                    {Number.isNaN(budget)
                      ? `${budgetRaw} ${currency}`
                      : `$${budget.toLocaleString()} ${currency}`}
                  </strong>
                </div>

                <div>
                  <span>Duration</span>

                  <strong>
                    {duration}
                  </strong>
                </div>

                <div>
                  <span>Project ID</span>

                  <strong>
                    #{projectId}
                  </strong>
                </div>

              </div>

              {/* =================================================
                  DESCRIPTION
                  ================================================= */}

              <div className="project-section">

                <span className="project-section-label">
                  PROJECT DESCRIPTION
                </span>

                <h2>
                  About this project
                </h2>

                <p>
                  {description}
                </p>

              </div>

              {/* =================================================
                  SKILLS
                  ================================================= */}

              <div className="project-section">

                <span className="project-section-label">
                  REQUIRED SKILLS
                </span>

                <h2>
                  Skills & technologies
                </h2>

                {skills.length > 0 ? (
                  <div className="project-skills">
                    {skills.map(
                      (skill: string, index: number) => (
                        <span
                          key={`${skill}-${index}`}
                        >
                          {skill}
                        </span>
                      )
                    )}
                  </div>
                ) : (
                  <p>
                    No specific skills were provided for this
                    project.
                  </p>
                )}

              </div>

            </article>

            {/* =================================================
                SIDEBAR
                ================================================= */}

            <aside className="project-sidebar">

              {/* =================================================
                  APPLY CARD
                  ================================================= */}

              <div className="apply-card">

                <span className="sidebar-label">
                  INTERESTED?
                </span>

                <h2>
                  Ready to work on this project?
                </h2>

                <p>
                  Send your proposal and show the client why
                  you are the right freelancer for the job.
                </p>

                <button
                  className="apply-button"
                  onClick={handleSendProposal}
                  disabled={
                    projectStatus !== "Open" ||
                    (user !== null &&
                      user.role !== "FREELANCER")
                  }
                >
                  {projectStatus !== "Open"
                    ? "Project Not Available"
                    : "Send a Proposal"}

                  {projectStatus === "Open" && (
                    <span>→</span>
                  )}
                </button>

              </div>

              {/* =================================================
                  CLIENT CARD
                  ================================================= */}

              <div className="client-card">

                <span className="sidebar-label">
                  POSTED BY
                </span>

                <div className="client-profile">

                  <div className="client-avatar">
                    C
                  </div>

                  <div>
                    <h3>
                      Client
                    </h3>

                    <p>
                      SkillBridge member
                    </p>
                  </div>

                </div>

                <div className="client-info">

                  <div>
                    <span>
                      Projects posted
                    </span>

                    <strong>
                      —
                    </strong>
                  </div>

                  <div>
                    <span>
                      Member since
                    </span>

                    <strong>
                      —
                    </strong>
                  </div>

                </div>

              </div>

            </aside>

          </div>
        </div>
      </section>
    </main>
  );
};

export default ProjectDetails;