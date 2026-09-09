import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Dashboard.css";

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  /* =====================================================
     SECURITY CHECK
  ===================================================== */

  if (!user) {
    navigate("/login");
    return null;
  }

  const isFreelancer = user.role === "FREELANCER";

  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

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
            S
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

            <button className="dashboard-nav-item active">
              <span>▦</span>
              Overview
            </button>

            {isFreelancer ? (
              <>
                <button className="dashboard-nav-item">
                  <span>💼</span>
                  My Projects
                </button>

                <button className="dashboard-nav-item">
                  <span>📄</span>
                  My Proposals
                </button>

                <button className="dashboard-nav-item">
                  <span>🔖</span>
                  Saved Jobs
                </button>
              </>
            ) : (
              <>
                <button className="dashboard-nav-item">
                  <span>💼</span>
                  My Projects
                </button>

                <button className="dashboard-nav-item">
                  <span>➕</span>
                  Post a Project
                </button>

                <button className="dashboard-nav-item">
                  <span>👥</span>
                  Freelancers
                </button>
              </>
            )}
          </div>

          <div className="dashboard-nav-section">

            <span className="dashboard-nav-title">
              COMMUNICATION
            </span>

            <button className="dashboard-nav-item">
              <span>💬</span>
              Messages
              <span className="dashboard-notification">
                3
              </span>
            </button>

          </div>

          <div className="dashboard-nav-section">

            <span className="dashboard-nav-title">
              ACCOUNT
            </span>

            <button className="dashboard-nav-item">
              <span>👤</span>
              My Profile
            </button>

            <button className="dashboard-nav-item">
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

        {/* Top bar */}
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
              {user.firstName?.charAt(0).toUpperCase()}
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
            {isFreelancer ? "🚀" : "💡"}
          </div>

        </section>


        {/* =====================================================
            STATISTICS
        ===================================================== */}

        <section className="dashboard-stats">

          <div className="stat-card">

            <div className="stat-icon blue">
              {isFreelancer ? "📄" : "💼"}
            </div>

            <div className="stat-content">

              <span>
                {isFreelancer
                  ? "Applications"
                  : "Projects Posted"}
              </span>

              <strong>
                {isFreelancer ? "12" : "8"}
              </strong>

              <small>
                <b>+12%</b> this month
              </small>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon green">
              {isFreelancer ? "⚡" : "📊"}
            </div>

            <div className="stat-content">

              <span>
                {isFreelancer
                  ? "Active Projects"
                  : "Active Projects"}
              </span>

              <strong>
                {isFreelancer ? "4" : "3"}
              </strong>

              <small>
                <b>+8%</b> this month
              </small>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon purple">
              {isFreelancer ? "💰" : "💳"}
            </div>

            <div className="stat-content">

              <span>
                {isFreelancer
                  ? "Total Earnings"
                  : "Total Spent"}
              </span>

              <strong>
                {isFreelancer
                  ? "$2,450"
                  : "$8,450"}
              </strong>

              <small>
                <b>+15%</b> this month
              </small>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon orange">
              {isFreelancer ? "⭐" : "👥"}
            </div>

            <div className="stat-content">

              <span>
                {isFreelancer
                  ? "Rating"
                  : "Proposals"}
              </span>

              <strong>
                {isFreelancer
                  ? "4.9"
                  : "24"}
              </strong>

              <small>
                {isFreelancer
                  ? "Excellent rating"
                  : "Waiting for review"}
              </small>

            </div>

          </div>

        </section>


        {/* =====================================================
            CONTENT GRID
        ===================================================== */}

        <section className="dashboard-content-grid">


          {/* =================================================
              LEFT - PROJECTS
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

              <button>
                View all →
              </button>

            </div>


            {/* Project 1 */}

            <div className="project-item">

              <div className="project-icon">
                ⚡
              </div>

              <div className="project-info">

                <h4>
                  {isFreelancer
                    ? "Modern React Web Application"
                    : "E-commerce Website"}
                </h4>

                <p>
                  {isFreelancer
                    ? "React · TypeScript · UI/UX"
                    : "Website development · React"}
                </p>

              </div>

              <div className="project-right">

                <strong>
                  {isFreelancer
                    ? "$800 - $1,200"
                    : "In Progress"}
                </strong>

                <span className="project-status">
                  Active
                </span>

              </div>

            </div>


            {/* Project 2 */}

            <div className="project-item">

              <div className="project-icon second">
                💻
              </div>

              <div className="project-info">

                <h4>
                  {isFreelancer
                    ? "Mobile App Development"
                    : "Business Dashboard"}
                </h4>

                <p>
                  {isFreelancer
                    ? "React Native · Firebase"
                    : "Dashboard · Data visualization"}
                </p>

              </div>

              <div className="project-right">

                <strong>
                  {isFreelancer
                    ? "$1,500 - $2,000"
                    : "5 proposals"}
                </strong>

                <span className="project-status pending">
                  {isFreelancer
                    ? "New"
                    : "Reviewing"}
                </span>

              </div>

            </div>


            {/* Project 3 */}

            <div className="project-item">

              <div className="project-icon third">
                🎨
              </div>

              <div className="project-info">

                <h4>
                  {isFreelancer
                    ? "UI/UX Design Project"
                    : "Brand Identity Design"}
                </h4>

                <p>
                  {isFreelancer
                    ? "Figma · UI Design"
                    : "Logo · Branding · Design"}
                </p>

              </div>

              <div className="project-right">

                <strong>
                  {isFreelancer
                    ? "$600 - $900"
                    : "8 proposals"}
                </strong>

                <span className="project-status pending">
                  New
                </span>

              </div>

            </div>

          </div>


          {/* =================================================
              RIGHT - PROFILE
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
                75%
              </span>

            </div>

            <div className="progress-bar">

              <div
                className="progress-value"
                style={{ width: "75%" }}
              />

            </div>

            <p className="profile-message">
              Complete your profile to attract
              more opportunities.
            </p>

            <button
              className="complete-profile"
            >
              Complete Profile →
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
                <button>
                  <span>🔎</span>
                  Find Projects
                </button>

                <button>
                  <span>📄</span>
                  View Proposals
                </button>

                <button>
                  <span>💬</span>
                  Open Messages
                </button>
              </>
            ) : (
              <>
                <button>
                  <span>➕</span>
                  Post a Project
                </button>

                <button>
                  <span>👥</span>
                  Find Freelancers
                </button>

                <button>
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