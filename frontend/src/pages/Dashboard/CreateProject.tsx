import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import projectService from "../../services/projectService";
import { useAuth } from "../../context/AuthContext";
import "./CreateProject.css";

const categories = [
  "Development",
  "Design",
  "Mobile",
  "Marketing",
  "Data & AI",
];

const CreateProject: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [budget, setBudget] = useState<number | "">("");
  const [currency, setCurrency] = useState("USD");
  const [duration, setDuration] = useState("");
  const [skills, setSkills] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        title,
        description,
        category,
        budget: budget === "" ? 0 : budget,
        currency,
        duration,
        skills_required: skills
          ? skills
              .split(",")
              .map((skill) => skill.trim())
              .filter(Boolean)
          : [],
      };

      await projectService.createProject(payload);

      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Failed to create project");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-project-page">
      <main>
        {/* HERO */}
        <section className="create-project-hero">
          <div className="create-project-container">
            <div className="create-project-heading">
              <span className="create-project-label">
                SKILLBRIDGE FOR CLIENTS
              </span>

              <h1>Post a Project</h1>

              <p>
                Tell us what you need and connect with skilled
                professionals who can bring your project to life.
              </p>
            </div>
          </div>
        </section>

        {/* FORM */}
        <section className="create-project-section">
          <div className="create-project-container">
            <div className="create-project-card">
              <div className="create-project-card-header">
                <div>
                  <span className="create-project-small-label">
                    PROJECT DETAILS
                  </span>

                  <h2>Tell us about your project</h2>

                  <p>
                    Provide enough details to help freelancers
                    understand your needs.
                  </p>
                </div>
              </div>

              {error && (
                <div className="create-project-error">
                  <span>!</span>
                  <p>{error}</p>
                </div>
              )}

              <form
                className="create-project-form"
                onSubmit={handleSubmit}
              >
                {/* TITLE */}
                <div className="create-project-field full">
                  <label htmlFor="project-title">
                    Project title
                    <span>*</span>
                  </label>

                  <input
                    id="project-title"
                    type="text"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="e.g. Build a modern e-commerce website"
                    required
                  />

                  <small>
                    Use a clear and specific title for your project.
                  </small>
                </div>

                {/* DESCRIPTION */}
                <div className="create-project-field full">
                  <label htmlFor="project-description">
                    Description
                    <span>*</span>
                  </label>

                  <textarea
                    id="project-description"
                    value={description}
                    onChange={(event) =>
                      setDescription(event.target.value)
                    }
                    placeholder="Describe your project, objectives, requirements and expected results..."
                    required
                  />

                  <small>
                    Explain what you need and what the freelancer should
                    deliver.
                  </small>
                </div>

                {/* CATEGORY */}
                <div className="create-project-form-grid">
                  <div className="create-project-field">
                    <label htmlFor="project-category">
                      Category
                      <span>*</span>
                    </label>

                    <select
                      id="project-category"
                      value={category}
                      onChange={(event) =>
                        setCategory(event.target.value)
                      }
                      required
                    >
                      <option value="">Select a category</option>

                      {categories.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* DURATION */}
                  <div className="create-project-field">
                    <label htmlFor="project-duration">
                      Duration
                      <span>*</span>
                    </label>

                    <input
                      id="project-duration"
                      type="text"
                      value={duration}
                      onChange={(event) =>
                        setDuration(event.target.value)
                      }
                      placeholder="e.g. 2 weeks"
                      required
                    />
                  </div>
                </div>

                {/* BUDGET */}
                <div className="create-project-form-grid budget-grid">
                  <div className="create-project-field">
                    <label htmlFor="project-budget">
                      Budget
                      <span>*</span>
                    </label>

                    <input
                      id="project-budget"
                      type="number"
                      min="0"
                      value={budget}
                      onChange={(event) =>
                        setBudget(
                          event.target.value === ""
                            ? ""
                            : Number(event.target.value)
                        )
                      }
                      placeholder="e.g. 1000"
                      required
                    />
                  </div>

                  {/* CURRENCY */}
                  <div className="create-project-field">
                    <label htmlFor="project-currency">
                      Currency
                    </label>

                    <select
                      id="project-currency"
                      value={currency}
                      onChange={(event) =>
                        setCurrency(event.target.value)
                      }
                    >
                      <option value="USD">USD — US Dollar</option>
                      <option value="EUR">EUR — Euro</option>
                      <option value="DZD">DZD — Algerian Dinar</option>
                    </select>
                  </div>
                </div>

                {/* SKILLS */}
                <div className="create-project-field full">
                  <label htmlFor="project-skills">
                    Required skills
                  </label>

                  <input
                    id="project-skills"
                    type="text"
                    value={skills}
                    onChange={(event) => setSkills(event.target.value)}
                    placeholder="React, TypeScript, UI/UX, PostgreSQL"
                  />

                  <small>
                    Separate skills with commas. This helps freelancers
                    understand the expertise required.
                  </small>
                </div>

                {/* DIVIDER */}
                <div className="create-project-divider" />

                {/* ACTIONS */}
                <div className="create-project-actions">
                  <button
                    type="button"
                    className="create-project-cancel"
                    onClick={() => navigate("/dashboard")}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="create-project-submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="create-project-spinner" />
                        Posting...
                      </>
                    ) : (
                      <>
                        Post Project
                        <span>→</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CreateProject;
