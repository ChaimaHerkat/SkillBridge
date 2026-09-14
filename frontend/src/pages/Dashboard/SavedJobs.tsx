import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import useProjects from "../../hooks/useProjects";
import useSavedProjects from "../../hooks/useSavedProjects";

import type { Project } from "../../types/project";

import "./SavedJobs.css";

const SavedJobs: React.FC = () => {
  const navigate = useNavigate();

  const {
    projects,
    isLoading,
    error,
  } = useProjects();

  const {
    savedProjectIds,
    removeSaved,
  } = useSavedProjects();

  const savedProjects = useMemo(() => {
    return (projects || []).filter((project: Project) =>
      savedProjectIds.includes(String(project.id))
    );
  }, [projects, savedProjectIds]);

  return (
    <div className="saved-jobs-page">
      <main className="saved-jobs-container">

        <div className="saved-jobs-header">
          <div>
            <span className="saved-jobs-label">
              FREELANCER WORKSPACE
            </span>

            <h1>Saved Jobs</h1>

            <p>
              Keep track of projects you are interested in
              and come back to them later.
            </p>
          </div>

          <div className="saved-jobs-count">
            <strong>{savedProjects.length}</strong>
            <span>
              {savedProjects.length === 1
                ? "saved job"
                : "saved jobs"}
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="saved-jobs-state">
            <div className="saved-jobs-loader" />
            <h2>Loading saved jobs...</h2>
          </div>
        ) : error ? (
          <div className="saved-jobs-state error">
            <h2>Unable to load projects</h2>
            <p>
              {error.message || "Something went wrong."}
            </p>
          </div>
        ) : savedProjects.length === 0 ? (
          <div className="saved-jobs-empty">
            <div className="saved-jobs-empty-icon">
              🔖
            </div>

            <span>NO SAVED JOBS</span>

            <h2>No saved jobs yet</h2>

            <p>
              When you find a project you are interested in,
              save it here so you can easily come back to it.
            </p>

            <button
              type="button"
              onClick={() => navigate("/marketplace")}
            >
              Browse Projects →
            </button>
          </div>
        ) : (
          <div className="saved-jobs-grid">
            {savedProjects.map((project: Project) => (
              <article
                className="saved-job-card"
                key={project.id}
              >
                <div className="saved-job-top">
                  <span className="saved-job-category">
                    {project.category}
                  </span>

                  <span className="saved-job-status">
                    <span className="status-dot" />
                    {project.status.replace("_", " ")}
                  </span>
                </div>

                <h2>{project.title}</h2>

                <p className="saved-job-description">
                  {project.description}
                </p>

                <div className="saved-job-details">
                  <div>
                    <span>Budget</span>
                    <strong>
                      {Number(project.budget).toLocaleString()}{" "}
                      {project.currency}
                    </strong>
                  </div>

                  <div>
                    <span>Duration</span>
                    <strong>
                      {project.duration}
                    </strong>
                  </div>
                </div>

                {project.skills_required?.length > 0 && (
                  <div className="saved-job-skills">
                    {project.skills_required.map((skill) => (
                      <span key={skill}>
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                <div className="saved-job-actions">
                  <button
                    type="button"
                    className="view-saved-job"
                    onClick={() =>
                      navigate(`/marketplace/${project.id}`)
                    }
                  >
                    View Project →
                  </button>

                  <button
                    type="button"
                    className="remove-saved-job"
                    onClick={() =>
                      removeSaved(project.id)
                    }
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

      </main>
    </div>
  );
};

export default SavedJobs;