import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import useProjects from "../../hooks/useProjects";
import type { Project } from "../../types/project";
import "./Marketplace.css";

const categories = [
  "All",
  "Development",
  "Design",
  "Mobile",
  "Marketing",
  "Data & AI",
];

const Marketplace: React.FC = () => {
  const navigate = useNavigate();

  const { projects, isLoading, error } = useProjects();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filteredProjects = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return (projects || []).filter((project: Project) => {
      const item = project as any;

      const title =
        item.title ||
        item.name ||
        "";

      const description =
        item.description ||
        item.desc ||
        "";

      const projectCategory =
        item.category ||
        item.category_name ||
        "";

      const matchesSearch =
        !searchValue ||
        title.toLowerCase().includes(searchValue) ||
        description.toLowerCase().includes(searchValue) ||
        projectCategory.toLowerCase().includes(searchValue);

      const matchesCategory =
        category === "All" ||
        projectCategory.toLowerCase() === category.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [projects, search, category]);

  return (
    <div className="marketplace-page">
      <Header />

      <main>
        {/* HERO */}
        <section className="marketplace-hero">
          <div className="marketplace-container">
            <div className="marketplace-heading">
              <span className="marketplace-label">
                SKILLBRIDGE MARKETPLACE
              </span>

              <h1>Find your next opportunity.</h1>

              <p>
                Discover projects posted by clients and find opportunities
                that match your skills, experience and goals.
              </p>
            </div>

            {/* SEARCH */}
            <div className="marketplace-search-wrapper">
              <div className="marketplace-search">
                <span className="marketplace-search-icon">⌕</span>

                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search projects, skills or keywords..."
                  aria-label="Search projects"
                />

                {search && (
                  <button
                    type="button"
                    className="marketplace-clear"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* COUNT */}
            <div className="marketplace-count">
              <strong>{filteredProjects.length}</strong>

              <span>
                {filteredProjects.length === 1
                  ? "project"
                  : "projects"}
              </span>
            </div>

            {/* FILTERS */}
            <div className="marketplace-filters">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={
                    category === item
                      ? "marketplace-filter active"
                      : "marketplace-filter"
                  }
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* PROJECTS */}
        <section className="marketplace-results">
          <div className="marketplace-container">
            <div className="marketplace-section-heading">
              <div>
                <span>OPPORTUNITIES</span>
                <h2>Available projects</h2>
                <p>
                  Explore projects posted by clients looking for
                  skilled professionals.
                </p>
              </div>
            </div>

            {isLoading ? (
              <div className="marketplace-state">
                <div className="state-loader" />
                <h2>Loading projects...</h2>
                <p>
                  We are looking for opportunities that match your
                  skills.
                </p>
              </div>
            ) : error ? (
              <div className="marketplace-state error-state">
                <div className="state-icon">!</div>

                <h2>Unable to load projects</h2>

                <p>{error.message || "Something went wrong."}</p>

                <button
                  type="button"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </button>
              </div>
            ) : filteredProjects.length > 0 ? (
              <div className="projects-grid">
                {filteredProjects.map((project: Project) => {
                  const item = project as any;

                  const id =
                    item.id ||
                    item.pk ||
                    item.project_id;

                  const title =
                    item.title ||
                    item.name ||
                    "Untitled project";

                  const description =
                    item.description ||
                    item.desc ||
                    "No description provided.";

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

                  const projectCategory =
                    item.category ||
                    item.category_name ||
                    "General";

                  return (
                    <article
                      className="project-card"
                      key={id}
                    >
                      <div className="project-card-top">
                        <span className="project-category">
                          {projectCategory}
                        </span>

                        <span className="project-status">
                          Open
                        </span>
                      </div>

                      <h3>{title}</h3>

                      <p className="project-description">
                        {description}
                      </p>

                      <div className="project-details">
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
                          <strong>{duration}</strong>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="project-button"
                        onClick={() =>
                          navigate(`/marketplace/${id}`)
                        }
                      >
                        View Project
                        <span>→</span>
                      </button>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="marketplace-empty">
                <div className="marketplace-empty-icon">
                  📂
                </div>

                <span className="empty-label">
                  NO OPPORTUNITIES YET
                </span>

                <h2>No projects available</h2>

                <p>
                  There are currently no projects matching your
                  search or filters. New opportunities will appear
                  here when clients post their projects.
                </p>

                {(search || category !== "All") && (
                  <button
                    type="button"
                    className="clear-filters-button"
                    onClick={() => {
                      setSearch("");
                      setCategory("All");
                    }}
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </div>
        </section>

        {/* CLIENT CTA */}
        <section className="marketplace-cta">
          <div className="marketplace-cta-inner">
            <span className="marketplace-label">
              FOR CLIENTS
            </span>

            <h2>Have a project in mind?</h2>

            <p>
              Post your project, describe what you need and connect
              with professionals who can bring your idea to life.
            </p>

            <button
              type="button"
              onClick={() => navigate("/register")}
            >
              Post a Project
              <span>→</span>
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Marketplace;