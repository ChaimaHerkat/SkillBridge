import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import projectService from "../../services/projectService";
import proposalService from "../../services/proposalService";
import type { Project } from "../../types/project";
import type { Proposal } from "../../services/proposalService";
import "./Dashboard.css";

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  /* =====================================================
     SECURITY CHECK
  ===================================================== */

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const isFreelancer = user?.role === "FREELANCER";

  /* =====================================================
     LOAD DASHBOARD DATA
  ===================================================== */

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;

      setIsLoadingData(true);

      try {
        const [projectsData, proposalsData] = await Promise.all([
          projectService.getProjects(),
          proposalService.getProposals(),
        ]);

        setProjects(projectsData);
        setProposals(proposalsData);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadDashboardData();
  }, [user]);

  /* =====================================================
     WAIT FOR USER
  ===================================================== */

  if (!user) {
    return null;
  }

  /* =====================================================
     FREELANCER STATISTICS
  ===================================================== */

  const freelancerProjects = projects.filter(
    (project) =>
      project.freelancer !== null &&
      String(project.freelancer) === String(user.id)
  );

  const activeFreelancerProjects = freelancerProjects.filter(
    (project) =>
      project.status === "open" ||
      project.status === "in_progress"
  );

  const completedFreelancerProjects = freelancerProjects.filter(
    (project) =>
      project.status === "completed"
  );

  

 


  /* Proposals submitted by the current freelancer */
const freelancerProposals = proposals.filter(
  (proposal) =>
    String(proposal.freelancer) === String(user.id)
);

/* Number of proposals submitted */
const applicationCount = freelancerProposals.length;

/* Accepted proposals */
const acceptedProposals = freelancerProposals.filter(
  (proposal) =>
    proposal.status?.toLowerCase() === "accepted"
);

/* Total value of accepted proposals */
const freelancerEarnings = acceptedProposals.reduce(
  (total, proposal) =>
    total + Number(proposal.proposed_budget || 0),
  0
);



  /* =====================================================
     CLIENT STATISTICS
  ===================================================== */

  const clientProjects = projects.filter(
    (project) =>
      String(project.client) === String(user.id)
  );

  const activeClientProjects = clientProjects.filter(
    (project) =>
      project.status === "open" ||
      project.status === "in_progress"
  );

  /* IDs of projects belonging to this client */
  const clientProjectIds = new Set(
    clientProjects.map((project) => project.id)
  );

  /* Proposals received on client's projects */
  const receivedProposals = proposals.filter(
    (proposal) =>
      clientProjectIds.has(Number(proposal.project))
  );

  /* Accepted proposals received by client */
  const acceptedClientProposals = receivedProposals.filter(
    (proposal) =>
      proposal.status?.toLowerCase() === "accepted"
  );

  /* Total value of accepted proposals */
  const clientTotalSpent = acceptedClientProposals.reduce(
    (total, proposal) =>
      total + Number(proposal.proposed_budget || 0),
    0
  );

  /* =====================================================
     RECOMMENDED PROJECTS FOR FREELANCER
  ===================================================== */

  const recommendedProjects = projects
    .filter(
      (project) =>
        project.status === "open" &&
        String(project.client) !== String(user.id) &&
        String(project.freelancer ?? "") !== String(user.id)
    )
    .slice(0, 3);

  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = () => {
    logout();
    navigate("/login");
  };


  /* =====================================================
     PROFILE COMPLETION
  ===================================================== */

  const profileFields = [
    user.firstName,
    user.lastName,
    user.email,
  ];

  const completedProfileFields = profileFields.filter(
    (field) => field && String(field).trim() !== ""
  ).length;

  const profileCompletion = Math.round(
    (completedProfileFields / profileFields.length) * 100
  );


  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="dashboard-page">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="dashboard-sidebar">

        {/* Logo */}

        <div
          className="dashboard-logo"
          onClick={() => navigate("/")}
        >
          <div className="dashboard-logo-icon">
            SB
          </div>

          <span>
            Skill<span>Bridge</span>
          </span>
        </div>

        {/* Navigation */}

        <nav className="dashboard-nav">

          <div className="dashboard-nav-section">

            <span className="dashboard-nav-title">
              MAIN
            </span>

            <button
             className="dashboard-nav-item active"
             onClick={() => navigate("/dashboard")}
            >
              <span>▦</span>
                Overview
            </button>

            {isFreelancer ? (
              <>
                <button
                  className="dashboard-nav-item"
                   onClick={() => navigate("/dashboard/my-projects")}
                >
                  <span>💼</span>
                     My Projects
                </button>

                <button
                  className="dashboard-nav-item"
                  onClick={() =>
                    navigate("/dashboard/proposals")
                  }
                >
                  <span>📄</span>
                  My Proposals
                </button>

                <button
                  className="dashboard-nav-item"
                  onClick={() => navigate("/dashboard/saved-jobs")}
                >
                  <span>🔖</span>
                     Saved Jobs
                </button>
              </>
            ) : (
              <>
                <button
                  className="dashboard-nav-item"
                  onClick={() =>
                    navigate("/dashboard/projects")
                  }
                >
                  <span>💼</span>
                  My Projects
                </button>

                <button
                  className="dashboard-nav-item"
                  onClick={() =>
                    navigate("/dashboard/create-project")
                  }
                >
                  <span>➕</span>
                  Post a Project
                </button>

                <button
                  className="dashboard-nav-item"
                  onClick={() =>
                    navigate("/freelancers")
                  }
                >
                  <span>👥</span>
                  Freelancers
                </button>
              </>
            )}

          </div>


          {/* Communication */}

          <div className="dashboard-nav-section">

            <span className="dashboard-nav-title">
              COMMUNICATION
            </span>

            <button
              className="dashboard-nav-item"
              onClick={() => navigate("/messages")}
            >
              <span>💬</span>
                 Messages
            </button>
            
          </div>


          {/* Account */}

          <div className="dashboard-nav-section">

            <span className="dashboard-nav-title">
              ACCOUNT
            </span>

            <button
              className="dashboard-nav-item"
              onClick={() => navigate("/dashboard/profile")}
            >
              <span>👤</span>
                 My Profile
            </button>

            <button 
              className="dashboard-nav-item"
              onClick={() => navigate("/dashboard/settings")}
            >
              <span>⚙</span>
              Settings
            </button>

          </div>

        </nav>


        {/* Logout */}

        <button
          className="dashboard-logout"
          onClick={handleLogout}
        >
          <span>↪</span>
          Logout
        </button>

      </aside>


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="dashboard-main">

        {/* =====================================================
            TOP BAR
        ===================================================== */}

        <div className="dashboard-topbar">

          <div>

            <span className="dashboard-page-label">
              DASHBOARD
            </span>

            <h1>
              Overview
            </h1>

          </div>


          <div className="dashboard-user">

            <div className="dashboard-user-info">

              <strong>
                {user.firstName} {user.lastName}
              </strong>

              <span>
                {isFreelancer
                  ? "Freelancer"
                  : "Client"}
              </span>

            </div>


            <div className="dashboard-avatar">
              {user.firstName
                ?.charAt(0)
                .toUpperCase()}
            </div>

          </div>

        </div>


        {/* =====================================================
            WELCOME CARD
        ===================================================== */}

        <section className="dashboard-welcome">

          <div>

            <span className="welcome-small">
              {isFreelancer
                ? "FREELANCER SPACE"
                : "CLIENT SPACE"}
            </span>

            <h2>
              Welcome back, {user.firstName} 👋
            </h2>

            <p>
              {isFreelancer
                ? "Discover new opportunities and grow your freelance career."
                : "Manage your projects and find talented professionals."}
            </p>

          </div>


          <div className="welcome-icon">
            {isFreelancer
              ? "🚀"
              : "💡"}
          </div>

        </section>


        {/* =====================================================
            REAL DASHBOARD STATISTICS
        ===================================================== */}

        <section className="dashboard-stats">

          {/* =================================================
              APPLICATIONS / PROJECTS POSTED
          ================================================= */}

          <div className="stat-card">

            <div className="stat-icon blue">
              {isFreelancer
                ? "📄"
                : "💼"}
            </div>

            <div className="stat-content">

              <span>
                {isFreelancer
                  ? "Applications"
                  : "Projects Posted"}
              </span>

              <strong>
                {isLoadingData
                  ? "..."
                  : isFreelancer
                    ? applicationCount
                    : clientProjects.length}
              </strong>

              <small>
                {isFreelancer
                  ? "Total submitted"
                  : "Total created"}
              </small>

            </div>

          </div>


          {/* =================================================
              ACTIVE PROJECTS
          ================================================= */}

          <div className="stat-card">

            <div className="stat-icon green">
              {isFreelancer
                ? "⚡"
                : "📊"}
            </div>

            <div className="stat-content">

              <span>
                Active Projects
              </span>

              <strong>
                {isLoadingData
                  ? "..."
                  : isFreelancer
                    ? activeFreelancerProjects.length
                    : activeClientProjects.length}
              </strong>

              <small>
                Currently active
              </small>

            </div>

          </div>


          {/* =================================================
              ACCEPTED VALUE
          ================================================= */}

          <div className="stat-card">

            <div className="stat-icon purple">
              {isFreelancer
                ? "💰"
                : "💳"}
            </div>

            <div className="stat-content">

              <span>
                Accepted Value
              </span>

              <strong>
                {isLoadingData
                  ? "..."
                  : isFreelancer
                    ? freelancerEarnings
                    : clientTotalSpent}
              </strong>

              <small>
                From accepted proposals
              </small>

            </div>

          </div>


          {/* =================================================
              COMPLETED / RECEIVED PROPOSALS
          ================================================= */}

          <div className="stat-card">

            <div className="stat-icon orange">
              {isFreelancer
                ? "✓"
                : "👥"}
            </div>

            <div className="stat-content">

              <span>
                {isFreelancer
                  ? "Completed Projects"
                  : "Received Proposals"}
              </span>

              <strong>
                {isLoadingData
                  ? "..."
                  : isFreelancer
                    ? completedFreelancerProjects.length
                    : receivedProposals.length}
              </strong>

              <small>
                {isFreelancer
                  ? "Successfully completed"
                  : "On your projects"}
              </small>

            </div>

          </div>

        </section>


        {/* =====================================================
            CONTENT GRID
        ===================================================== */}

        <section className="dashboard-content-grid">


          {/* =================================================
              PROJECTS CARD
          ================================================= */}

          <div className="dashboard-card projects-card">

            <div className="card-header">

              <div>

                <span className="card-label">
                  {isFreelancer
                    ? "RECOMMENDED"
                    : "RECENT"}
                </span>

                <h3>
                  {isFreelancer
                    ? "Recommended Projects"
                    : "Your Projects"}
                </h3>

              </div>


              <button
                type="button"
                onClick={() =>
                  navigate(
                    isFreelancer
                      ? "/marketplace"
                      : "/dashboard/projects"
                  )
                }
              >
                View all →
              </button>

            </div>


            {/* =================================================
                FREELANCER PROJECTS
            ================================================= */}
              
            {isFreelancer ? (

              recommendedProjects.length > 0 ? (

                <div className="recommended-projects-list">

                  {recommendedProjects.map((project) => (

                    <div
                      className="project-item"
                      key={project.id}
                      onClick={() =>
                        navigate(`/marketplace/${project.id}`)
                      }
                      role="button"
                      tabIndex={0}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          navigate(`/marketplace/${project.id}`);
                        }
                      }}
                    >

                      <div className="project-icon">
                        💼
                      </div>

                      <div className="project-info">

                        <h4>
                          {project.title}
                        </h4>

                        <p>
                          {project.skills_required?.length
                            ? project.skills_required
                                .slice(0, 3)
                                .join(" · ")
                            : project.category || "Project"}
                        </p>

                      </div>

                      <div className="project-right">

                        <strong>
                          {project.currency} {project.budget}
                        </strong>

                        <span className="project-status pending">
                          New
                        </span>

                      </div>

                    </div>

                  ))}

                </div>

              ) : (

                <div className="recommended-empty">

                  <div className="recommended-empty-icon">
                    <span>💼</span>
                  </div>

                  <div className="recommended-empty-content">

                    <h4>
                      No projects available
                    </h4>

                    <p>
                      There are no new opportunities available
                      for you right now.
                    </p>

                  </div>

                  <button
                    type="button"
                    className="recommended-browse-button"
                    onClick={() =>
                      navigate("/marketplace")
                    }
                  >
                    Browse Marketplace
                    <span>→</span>
                  </button>

                </div>

              )

            ) : (



              /* =================================================
                 CLIENT PROJECTS
              ================================================= */

              clientProjects.length > 0 ? (

                clientProjects
                  .slice(0, 3)
                  .map((project) => {

                    const projectProposals =
                      receivedProposals.filter(
                        (proposal) =>
                          Number(proposal.project) ===
                          Number(project.id)
                      );

                    const projectAccepted =
                      projectProposals.some(
                        (proposal) =>
                          proposal.status
                            ?.toLowerCase() ===
                          "accepted"
                      );

                    return (

                      <div
                        className="project-item"
                        key={project.id}
                      >

                        <div className="project-icon">
                          {project.status ===
                          "in_progress"
                            ? "⚡"
                            : "💼"}
                        </div>


                        <div className="project-info">

                          <h4>
                            {project.title}
                          </h4>

                          <p>
                            {project.skills_required?.length
                              ? project.skills_required
                                  .slice(0, 3)
                                  .join(" · ")
                              : project.category ||
                                "Project"}
                          </p>

                        </div>


                        <div className="project-right">

                          <strong>
                            {projectProposals.length}{" "}
                            {projectProposals.length === 1
                              ? "proposal"
                              : "proposals"}
                          </strong>

                          <span
                            className={
                              projectAccepted
                                ? "project-status"
                                : "project-status pending"
                            }
                          >
                            {projectAccepted
                              ? "Accepted"
                              : project.status ===
                                  "in_progress"
                                ? "In Progress"
                                : "Reviewing"}
                          </span>

                        </div>

                      </div>

                    );

                  })

              ) : (

                <div className="recommended-empty">

                  <p>
                    You have not posted any projects yet.
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        "/dashboard/create-project"
                      )
                    }
                  >
                    Post Your First Project →
                  </button>

                </div>

              )

            )}

          </div>


          {/* =================================================
              PROFILE CARD
          ================================================= */}

          <div className="dashboard-card profile-card">

            <div className="card-header">

              <div>

                <span className="card-label">
                  PROFILE
                </span>

                <h3>
                  Profile Completion
                </h3>

              </div>

              <span className="profile-percent">
                {profileCompletion}%
              </span>

            </div>


            <div className="progress-bar">

              <div
                className="progress-value"
                style={{
                  width: `${profileCompletion}%`
                }}
              />

            </div>


            <p className="profile-message">
              {profileCompletion === 100
                ? "Your profile is complete. Great job!"
                : "Complete your profile to attract more opportunities."}
            </p>


            <button
              className="complete-profile"
              type="button"
              onClick={() => navigate("/dashboard/profile")}
            >
              {profileCompletion === 100
                ? "View Profile →"
                : "Complete Profile →"}
            </button>

          </div>


          

        </section>


        {/* =====================================================
            QUICK ACTIONS
        ===================================================== */}

        <section className="quick-actions">

          <span className="card-label">
            QUICK ACTIONS
          </span>


          <div className="quick-actions-grid">

            {isFreelancer ? (

              <>

                <button
                  onClick={() =>
                    navigate("/marketplace")
                  }
                >
                  <span>🔎</span>
                  Find Projects
                </button>


                <button
                  onClick={() =>
                    navigate(
                      "/dashboard/proposals"
                    )
                  }
                >
                  <span>📄</span>
                  View Proposals
                </button>


                <button
                  onClick={() =>
                    navigate("/messages")
                  }
                >
                  <span>💬</span>
                  Open Messages
                </button>

              </>

            ) : (

              <>

                <button
                  onClick={() =>
                    navigate(
                      "/dashboard/create-project"
                    )
                  }
                >
                  <span>➕</span>
                  Post a Project
                </button>


                <button
                  onClick={() =>
                    navigate("/freelancers")
                  }
                >
                  <span>👥</span>
                  Find Freelancers
                </button>


                <button
                  onClick={() =>
                    navigate("/messages")
                  }
                >
                  <span>💬</span>
                  Open Messages
                </button>

              </>

            )}

          </div>

        </section>

      </main>

    </div>
  );
};

export default Dashboard;
