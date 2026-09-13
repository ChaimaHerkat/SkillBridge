import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./MyProfile.css";

type ProfileTab = "about" | "skills" | "projects";

function MyProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<ProfileTab>("about");

  if (!user) {
    return (
      <main className="profile-page">
        <div className="profile-loading">
          <p>Loading profile...</p>
        </div>
      </main>
    );
  }

  const fullName =
    `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
    user.username;

  const initials =
    `${user.firstName?.charAt(0) || ""}${
      user.lastName?.charAt(0) || ""
    }`.toUpperCase() || user.username.charAt(0).toUpperCase();

  const isFreelancer = user.role === "FREELANCER";
  const roleLabel = isFreelancer ? "Freelancer" : "Client";

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Active member";

  const profileCompletion = [
    Boolean(user.firstName),
    Boolean(user.lastName),
    Boolean(user.username),
    Boolean(user.email),
    Boolean(user.bio),
    Boolean(user.avatar),
  ].filter(Boolean).length;

  const profileCompletionPercentage = Math.round(
    (profileCompletion / 6) * 100
  );

  const tabs: { id: ProfileTab; label: string }[] = [
    {
      id: "about",
      label: "About",
    },
    {
      id: "skills",
      label: "Skills",
    },
    {
      id: "projects",
      label: isFreelancer ? "Projects" : "Posted projects",
    },
  ];

  const handleEditProfile = () => {
    navigate("/dashboard/settings");
  };

  const handleMessage = () => {
    navigate("/messages");
  };

  const handlePostProject = () => {
    navigate("/dashboard/create-project");
  };

  return (
    <main className="profile-page">
      <div className="profile-wrapper">
        {/* =========================
            PROFILE HEADER
        ========================= */}
        <section className="profile-header-card">
          <div className="profile-header-left">
            <div className="avatar-box">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={fullName}
                  className="avatar-circle profile-avatar-image"
                />
              ) : (
                <div className="avatar-circle">{initials}</div>
              )}

              <span className="online-dot"></span>
            </div>

            <div className="profile-header-info">
              <div className="profile-name-row">
                <h1 className="profile-name">{fullName}</h1>

                <span className="role-badge">{roleLabel}</span>
              </div>

              <p className="profile-username">@{user.username}</p>

              <p className="profile-email">{user.email}</p>

              <span className="member-since">
                Member since {memberSince}
              </span>
            </div>
          </div>

          <div className="profile-header-actions">
            <button
              className="btn btn-outline"
              type="button"
              onClick={handleMessage}
            >
              ✉ Message
            </button>

            <button
              className="btn btn-blue"
              type="button"
              onClick={handleEditProfile}
            >
              Edit profile
            </button>
          </div>
        </section>

        {/* =========================
            PROFILE HIGHLIGHTS
        ========================= */}
        <section className="profile-highlights">
          <div className="highlight-item">
            <span className="highlight-icon">◉</span>

            <div>
              <span className="highlight-label">Account type</span>
              <strong>{roleLabel}</strong>
            </div>
          </div>

          <div className="highlight-item">
            <span className="highlight-icon">✓</span>

            <div>
              <span className="highlight-label">Account status</span>
              <strong className="green-text">Active</strong>
            </div>
          </div>

          <div className="highlight-item">
            <span className="highlight-icon">✦</span>

            <div>
              <span className="highlight-label">Profile completion</span>
              <strong>{profileCompletionPercentage}%</strong>
            </div>
          </div>
        </section>

        {/* =========================
            TABS
        ========================= */}
        <nav className="profile-tabs-bar" aria-label="Profile sections">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-item ${
                activeTab === tab.id ? "active" : ""
              }`}
              onClick={() => setActiveTab(tab.id)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* =========================
            CONTENT GRID
        ========================= */}
        <div className="profile-grid">
          {/* =========================
              MAIN CONTENT
          ========================= */}
          <section className="profile-main-card">
            {activeTab === "about" && (
              <div className="tab-content">
                <span className="sub-title">PROFILE OVERVIEW</span>

                <h2 className="main-title">About {fullName}</h2>

                {user.bio ? (
                  <p className="body-text">{user.bio}</p>
                ) : (
                  <div className="about-introduction">
                    <div className="introduction-icon">✦</div>

                    <div>
                      <h3>
                        {isFreelancer
                          ? "Introduce yourself to potential clients"
                          : "Tell freelancers more about yourself"}
                      </h3>

                      <p>
                        {isFreelancer
                          ? "Add a short professional introduction to explain your expertise, experience and the type of projects you can work on."
                          : "Add a short introduction to explain your interests, project needs and what you expect from freelancers."}
                      </p>

                      <button
                        className="btn btn-blue"
                        type="button"
                        onClick={handleEditProfile}
                      >
                        Add introduction
                      </button>
                    </div>
                  </div>
                )}

                <div className="about-role-box">
                  <div className="about-role-icon">
                    {isFreelancer ? "◆" : "◇"}
                  </div>

                  <div>
                    <h3>
                      {isFreelancer
                        ? "Professional freelancer"
                        : "Project owner"}
                    </h3>

                    <p>
                      {isFreelancer
                        ? "Use SkillBridge to showcase your expertise, discover projects and collaborate with clients."
                        : "Use SkillBridge to publish projects, receive proposals and connect with qualified freelancers."}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "skills" && (
              <div className="tab-content">
                <span className="sub-title">EXPERTISE</span>

                <h2 className="main-title">
                  {isFreelancer
                    ? "Skills & professional expertise"
                    : "Skills & interests"}
                </h2>

                <p className="body-text">
                  {isFreelancer
                    ? "Add the technologies, tools and professional skills that you can offer to clients."
                    : "Add your skills and interests to help freelancers understand your project needs."}
                </p>

                <div className="skills-empty-box">
                  <div className="skills-empty-icon">✦</div>

                  <h3>No skills added yet</h3>

                  <p>
                    Your skills will appear here once you add them to
                    your profile.
                  </p>

                  <button
                    className="btn btn-blue"
                    type="button"
                    onClick={handleEditProfile}
                  >
                    Add skills
                  </button>
                </div>
              </div>
            )}

            {activeTab === "projects" && (
              <div className="tab-content">
                <span className="sub-title">PORTFOLIO</span>

                <h2 className="main-title">
                  {isFreelancer ? "My projects" : "Posted projects"}
                </h2>

                <p className="body-text">
                  {isFreelancer
                    ? "Showcase the projects you have completed and the experience you have gained."
                    : "Manage the projects you have posted and follow their progress from your dashboard."}
                </p>

                <div className="empty-state-box">
                  <div className="folder-icon">📁</div>

                  <h3 className="empty-title">
                    {isFreelancer
                      ? "Your projects will appear here"
                      : "Your posted projects will appear here"}
                  </h3>

                  <p className="empty-text">
                    {isFreelancer
                      ? "Completed projects can be displayed here to help clients discover your experience."
                      : "Create your first project on SkillBridge to start receiving proposals from freelancers."}
                  </p>

                  {!isFreelancer && (
                    <button
                      className="btn btn-blue"
                      type="button"
                      onClick={handlePostProject}
                    >
                      Post a project
                    </button>
                  )}
                </div>
              </div>
            )}
          </section>

          {/* =========================
              SIDEBAR
          ========================= */}
          <aside className="profile-sidebar">
            {/* Mini profile */}
            <section className="side-card side-user-card">
              <div className="mini-avatar">
                {initials}
              </div>

              <div className="side-user-info">
                <strong className="side-user-name">
                  {fullName}
                </strong>

                <span className="side-user-role">{roleLabel}</span>

                <span className="side-user-status">
                  <span className="status-dot"></span>
                  Active member
                </span>
              </div>
            </section>

            {/* Contact */}
            <section className="side-card">
              <h3 className="side-card-title">
                Contact information
              </h3>

              <div className="contact-row">
                <span className="icon-badge">✉</span>

                <div className="contact-details">
                  <span className="contact-label">EMAIL</span>
                  <span className="contact-value">
                    {user.email}
                  </span>
                </div>
              </div>

              <div className="contact-row">
                <span className="icon-badge">◉</span>

                <div className="contact-details">
                  <span className="contact-label">USERNAME</span>
                  <span className="contact-value">
                    @{user.username}
                  </span>
                </div>
              </div>
            </section>

            {/* Account */}
            <section className="side-card">
              <h3 className="side-card-title">Account</h3>

              <div className="meta-row">
                <span className="meta-key">Account type</span>
                <span className="meta-val blue-text">
                  {roleLabel}
                </span>
              </div>

              <div className="meta-row">
                <span className="meta-key">Member since</span>
                <span className="meta-val">{memberSince}</span>
              </div>

              <div className="meta-row">
                <span className="meta-key">Status</span>
                <span className="meta-val green-text">Active</span>
              </div>
            </section>

            {/* Profile strength */}
            <section className="side-card">
              <h3 className="side-card-title">
                Profile strength
              </h3>

              <div className="strength-row">
                <span>Profile completion</span>

                <strong>
                  {profileCompletionPercentage}%
                </strong>
              </div>

              <div className="progress-bg">
                <div
                  className="progress-bar"
                  style={{
                    width: `${profileCompletionPercentage}%`,
                  }}
                ></div>
              </div>

              <p className="side-hint">
                {user.bio
                  ? "Your introduction is already added. Add skills and projects to make your profile stronger."
                  : "Add a bio, skills and projects to make your profile more complete."}
              </p>
            </section>

            {/* Role information */}
            <section className="side-card role-box">
              <div className="diamond-icon">
                {isFreelancer ? "◆" : "◇"}
              </div>

              <h4 className="role-title">
                {isFreelancer
                  ? "Freelancer workspace"
                  : "Client workspace"}
              </h4>

              <p className="role-desc">
                {isFreelancer
                  ? "Discover opportunities, submit proposals and collaborate with clients."
                  : "Publish projects, review proposals and work with skilled freelancers."}
              </p>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default MyProfile;