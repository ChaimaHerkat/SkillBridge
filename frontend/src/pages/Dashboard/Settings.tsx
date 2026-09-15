import React, { useEffect, useState } from "react";
import "./Settings.css";
import { useAuth } from "../../context/AuthContext";
import authService from "../../services/authService";

type TabType = "profile" | "security" | "notifications" | "billing";

type NotificationPreferences = {
  emailMessages: boolean;
  emailProjects: boolean;
  emailMarketing: boolean;
  browserAlerts: boolean;
};

const NOTIFICATIONS_STORAGE_KEY =
  "skillbridge_notification_preferences";

const DEFAULT_NOTIFICATIONS: NotificationPreferences = {
  emailMessages: true,
  emailProjects: true,
  emailMarketing: false,
  browserAlerts: true,
};

export const Settings: React.FC = () => {
  const { user, updateUser } = useAuth();

  const [activeTab, setActiveTab] = useState<TabType>("profile");

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);

  // ============================================================
  // PASSWORD VISIBILITY
  // ============================================================

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  // ============================================================
  // PASSWORD FORM
  // ============================================================

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // ============================================================
  // PROFILE FORM
  // ============================================================

  const [profileData, setProfileData] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    bio: "",
    location: "",
    website: "",
  });

  // ============================================================
  // NOTIFICATIONS
  // ============================================================

  const [notifications, setNotifications] =
    useState<NotificationPreferences>(
      DEFAULT_NOTIFICATIONS
    );

  // ============================================================
  // LOAD USER DATA INTO FORM
  // ============================================================

  useEffect(() => {
    if (!user) {
      return;
    }

    setProfileData({
      fullName:
        `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      username: user.username || "",
      email: user.email || "",
      phone: "",
      bio: user.bio || "",
      location: "",
      website: "",
    });
  }, [user]);

  // ============================================================
  // LOAD NOTIFICATION PREFERENCES
  // ============================================================

  useEffect(() => {
   if (!user) {
    return;
   }

   setProfileData({
    fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
    username: user.username || "",
    email: user.email || "",
    phone: user.phone || "",
    bio: user.bio || "",
    location: user.location || "",
    website: user.website || "",
   });
}, [user]);



  // ============================================================
  // PROFILE - SAVE
  // ============================================================

  const handleSave = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!user) {
    return;
  }

  setProfileError("");
  setSaveSuccess(false);
  setProfileLoading(true);

  try {
    const nameParts = profileData.fullName
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ");
    const email = profileData.email.trim();

    if (!firstName) {
      setProfileError("Please enter your full name.");
      setProfileLoading(false);
      return;
    }

    if (!email) {
      setProfileError("Please enter your email address.");
      setProfileLoading(false);
      return;
    }

    await updateUser({
      firstName,
      lastName,
      email,
      phone: profileData.phone.trim(),
      location: profileData.location.trim(),
      website: profileData.website.trim(),
      bio: profileData.bio.trim(),
    });

    setProfileData((previous) => ({
      ...previous,
      fullName: `${firstName} ${lastName}`.trim(),
      email,
    }));

    setSaveSuccess(true);

    window.setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  } catch (error: unknown) {
    console.error("Failed to update profile:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Failed to update profile. Please try again.";

    setProfileError(message);
  } finally {
    setProfileLoading(false);
  }
};

  // ============================================================
  // PROFILE - CANCEL
  // ============================================================

  const handleCancelProfile = () => {
    if (!user) {
      return;
    }

    setProfileData({
      fullName:
        `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      username: user.username || "",
      email: user.email || "",
      phone: "",
      bio: user.bio || "",
      location: "",
      website: "",
    });

    setProfileError("");
    setSaveSuccess(false);
  };

  // ============================================================
  // PASSWORD UPDATE
  // ============================================================

  const handlePasswordUpdate = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setPasswordError("");
    setPasswordSuccess("");

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      setPasswordError(
        "Please fill in all password fields."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(
        "New password and confirmation do not match."
      );
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError(
        "The new password must be different from your current password."
      );
      return;
    }

    setPasswordLoading(true);

    try {
      const response = await authService.updatePassword(
        currentPassword,
        newPassword
      );

      setPasswordSuccess(
        response?.message ||
          "Password updated successfully."
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      window.setTimeout(() => {
        setPasswordSuccess("");
      }, 4000);
    } catch (error: unknown) {
      console.error(
        "Failed to update password:",
        error
      );

      let message =
        "Failed to update password. Please try again.";

      const errorBody =
        typeof error === "object" &&
        error !== null &&
        "body" in error
          ? (
              error as {
                body?: {
                  detail?: string | string[];
                };
              }
            ).body
          : undefined;

      if (errorBody?.detail) {
        if (Array.isArray(errorBody.detail)) {
          message = errorBody.detail.join(" ");
        } else {
          message = String(errorBody.detail);
        }
      } else if (error instanceof Error) {
        message = error.message;
      }

      setPasswordError(message);
    } finally {
      setPasswordLoading(false);
    }
  };

  // ============================================================
  // NOTIFICATIONS - SAVE
  // ============================================================

  const handleSaveNotifications = () => {
    try {
      localStorage.setItem(
        NOTIFICATIONS_STORAGE_KEY,
        JSON.stringify(notifications)
      );

      setSaveSuccess(true);

      window.setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error(
        "Failed to save notification preferences:",
        error
      );
    }
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="settings-wrapper">
      {/* ======================================================
          SUCCESS TOAST
      ====================================================== */}

      {saveSuccess && (
        <div className="toast-notification">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>

          Changes saved successfully!
        </div>
      )}

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="settings-header">
        <div>
          <h1 className="settings-title">
            Account Settings
          </h1>

          <p className="settings-subtitle">
            Manage your personal information, security and
            preferences.
          </p>
        </div>
      </div>

      <div className="settings-container">
        {/* ====================================================
            SIDEBAR
        ==================================================== */}

        <nav className="settings-sidebar">
          {/* Profile */}
          <button
            type="button"
            className={`sidebar-tab ${
              activeTab === "profile" ? "active" : ""
            }`}
            onClick={() => setActiveTab("profile")}
          >
            <svg
              className="tab-icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>

            Profile
          </button>

          {/* Security */}
          <button
            type="button"
            className={`sidebar-tab ${
              activeTab === "security" ? "active" : ""
            }`}
            onClick={() => setActiveTab("security")}
          >
            <svg
              className="tab-icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect
                x="3"
                y="11"
                width="18"
                height="11"
                rx="2"
                ry="2"
              />

              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>

            Security
          </button>

          {/* Notifications */}
          <button
            type="button"
            className={`sidebar-tab ${
              activeTab === "notifications"
                ? "active"
                : ""
            }`}
            onClick={() => setActiveTab("notifications")}
          >
            <svg
              className="tab-icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>

            Notifications
          </button>

          {/* Billing */}
          <button
            type="button"
            className={`sidebar-tab ${
              activeTab === "billing" ? "active" : ""
            }`}
            onClick={() => setActiveTab("billing")}
          >
            <svg
              className="tab-icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect
                x="1"
                y="4"
                width="22"
                height="16"
                rx="2"
                ry="2"
              />

              <line
                x1="1"
                y1="10"
                x2="23"
                y2="10"
              />
            </svg>

            Billing & Plan
          </button>
        </nav>

        {/* ====================================================
            MAIN CONTENT
        ==================================================== */}

        <main className="settings-content">
          {/* ==================================================
              PROFILE TAB
          ================================================== */}

          {activeTab === "profile" && (
            <div className="settings-pane">
              <div className="pane-header">
                <div>
                  <h2 className="pane-title">
                    Profile Information
                  </h2>

                  <p className="pane-description">
                    Update your public information and contact
                    details.
                  </p>
                </div>
              </div>

              {/* Avatar */}
              <div className="avatar-section">
                <div className="avatar-wrapper">
                  <div className="avatar-large">
                    {user
                      ? `${user.firstName?.charAt(0) || ""}${
                          user.lastName?.charAt(0) || ""
                        }`.toUpperCase()
                      : "U"}
                  </div>

                  <button
                    type="button"
                    className="avatar-edit-badge"
                    title="Profile picture upload is not available yet"
                    disabled
                  >
                    📷
                  </button>
                </div>

                <div className="avatar-info">
                  <h4>Profile Picture</h4>

                  <p>
                    Profile picture upload will be available
                    in a future version.
                  </p>

                  <div className="avatar-btn-group">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      disabled
                    >
                      Update
                    </button>

                    <button
                      type="button"
                      className="btn btn-ghost btn-sm text-danger"
                      disabled
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>

              {/* Profile Form */}
              <form
                className="settings-form"
                onSubmit={handleSave}
              >
                {profileError && (
                  <div className="password-message password-error">
                    {profileError}
                  </div>
                )}

                {/* Full Name / Username */}
                <div className="form-grid">
                  <div className="form-group">
                    <label>Full Name</label>

                    <input
                      type="text"
                      value={profileData.fullName}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          fullName: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Username</label>

                    <div className="input-prefix-wrapper">
                      <span className="input-prefix">
                        @
                      </span>

                      <input
                        type="text"
                        value={profileData.username}
                        disabled
                      />
                    </div>

                    <span className="field-hint">
                      Your username cannot be changed.
                    </span>
                  </div>
                </div>

                {/* Email / Phone */}
                <div className="form-grid">
                  <div className="form-group">
                    <label>Email Address</label>

                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>


                  <div className="form-group">
                    <label>Phone Number</label>

                      <input
                       type="tel"
                       value={profileData.phone}
                       onChange={(e) =>
                        setProfileData({
                         ...profileData,
                         phone: e.target.value,
                        })
                       }
                       placeholder="+213 ..."
                      />

                     <span className="field-hint">
                        Your phone number is optional.
                     </span>
                  </div>
                </div>


                {/* Location / Website */}
                <div className="form-group">
                  <label>Location</label>

                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          location: e.target.value,
                        })
                      }
                      placeholder="Algiers, Algeria"
                    />

                     <span className="field-hint">
                         Your location is optional.
                     </span>
                </div>


                  <div className="form-group">
                   <label>Website / Portfolio</label>

                    <input
                      type="url"
                      value={profileData.website}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          website: e.target.value,
                        })
                      }
                      placeholder="https://yourwebsite.com"
                    />

                      <span className="field-hint">
                        Add your personal website or portfolio.
                      </span>
                  </div>


                {/* Bio */}
                <div className="form-group">
                 <label>Bio / About</label>

                   <textarea
                    value={profileData.bio}
                    onChange={(e) =>
                       setProfileData({
                        ...profileData,
                        bio: e.target.value,
                       })
                    }
                   placeholder="Tell us about yourself..."
                   rows={5}
                   />

                    <span className="field-hint">
                       Introduce yourself and describe your experience.
                    </span>
                </div>

                {/* Actions */}
                <div className="form-footer">
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={handleCancelProfile}
                    disabled={profileLoading}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={profileLoading}
                  >
                    {profileLoading
                      ? "Saving..."
                      : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ==================================================
              SECURITY TAB
          ================================================== */}

          {activeTab === "security" && (
            <div className="settings-pane">
              <div className="pane-header">
                <div>
                  <h2 className="pane-title">
                    Account Security
                  </h2>

                  <p className="pane-description">
                    Manage your password and enable additional
                    security protections.
                  </p>
                </div>
              </div>

              {/* Password Form */}
              <form
                className="settings-form"
                onSubmit={handlePasswordUpdate}
              >
                {passwordError && (
                  <div className="password-message password-error">
                    {passwordError}
                  </div>
                )}

                {passwordSuccess && (
                  <div className="password-message password-success">
                    {passwordSuccess}
                  </div>
                )}

                {/* Current Password */}
                <div className="form-group">
                  <label>Current Password</label>

                  <div className="password-input-wrapper">
                    <input
                      type={
                        showCurrentPassword
                          ? "text"
                          : "password"
                      }
                      value={currentPassword}
                      onChange={(e) =>
                        setCurrentPassword(e.target.value)
                      }
                      placeholder="••••••••••••"
                      autoComplete="current-password"
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() =>
                        setShowCurrentPassword(
                          !showCurrentPassword
                        )
                      }
                      title={
                        showCurrentPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showCurrentPassword
                        ? "🙈"
                        : "👁️"}
                    </button>
                  </div>
                </div>

                {/* New Password / Confirm Password */}
                <div className="form-grid">
                  <div className="form-group">
                    <label>New Password</label>

                    <div className="password-input-wrapper">
                      <input
                        type={
                          showNewPassword
                            ? "text"
                            : "password"
                        }
                        value={newPassword}
                        onChange={(e) =>
                          setNewPassword(e.target.value)
                        }
                        placeholder="••••••••••••"
                        autoComplete="new-password"
                      />

                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() =>
                          setShowNewPassword(
                            !showNewPassword
                          )
                        }
                        title={
                          showNewPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showNewPassword
                          ? "🙈"
                          : "👁️"}
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Confirm Password</label>

                    <div className="password-input-wrapper">
                      <input
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        value={confirmPassword}
                        onChange={(e) =>
                          setConfirmPassword(e.target.value)
                        }
                        placeholder="••••••••••••"
                        autoComplete="new-password"
                      />

                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() =>
                          setShowConfirmPassword(
                            !showConfirmPassword
                          )
                        }
                        title={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showConfirmPassword
                          ? "🙈"
                          : "👁️"}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="form-footer">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={passwordLoading}
                  >
                    {passwordLoading
                      ? "Updating..."
                      : "Update Password"}
                  </button>
                </div>
              </form>

              <hr className="divider" />

              {/* 2FA */}
              <div className="security-card">
                <div className="security-card-info">
                  <h4>
                    Two-Factor Authentication (2FA)
                  </h4>

                  <p>
                    Add an extra layer of security to your
                    account using an authentication app such
                    as Google Authenticator.
                  </p>
                </div>

                <button
                  type="button"
                  className="btn btn-secondary"
                  disabled
                  title="2FA is not implemented yet"
                >
                  Enable 2FA
                </button>
              </div>

              <hr className="divider" />

              {/* Danger Zone */}
              <div className="danger-zone-box">
                <div className="danger-zone-header">
                  <h4>Danger Zone</h4>

                  <p>
                    Account deletion is not available yet.
                  </p>
                </div>

                <button
                  type="button"
                  className="btn btn-danger"
                  disabled
                  title="Account deletion is not implemented yet"
                >
                  Delete Account
                </button>
              </div>
            </div>
          )}

          {/* ==================================================
              NOTIFICATIONS TAB
          ================================================== */}

          {activeTab === "notifications" && (
            <div className="settings-pane">
              <div className="pane-header">
                <div>
                  <h2 className="pane-title">
                    Notification Preferences
                  </h2>

                  <p className="pane-description">
                    Choose which notification preferences you
                    would like to save.
                  </p>
                </div>
              </div>

              <div className="toggle-list">
                {/* Direct Messages */}
                <div className="toggle-item">
                  <div className="toggle-info">
                    <strong>Direct Messages</strong>

                    <p>
                      Save your preference for message
                      notifications.
                    </p>
                  </div>

                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={
                        notifications.emailMessages
                      }
                      onChange={(e) =>
                        setNotifications({
                          ...notifications,
                          emailMessages:
                            e.target.checked,
                        })
                      }
                    />

                    <span className="slider"></span>
                  </label>
                </div>

                {/* Project Updates */}
                <div className="toggle-item">
                  <div className="toggle-info">
                    <strong>Project Updates</strong>

                    <p>
                      Save your preference for project and
                      proposal notifications.
                    </p>
                  </div>

                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={
                        notifications.emailProjects
                      }
                      onChange={(e) =>
                        setNotifications({
                          ...notifications,
                          emailProjects:
                            e.target.checked,
                        })
                      }
                    />

                    <span className="slider"></span>
                  </label>
                </div>

                {/* Browser Notifications */}
                <div className="toggle-item">
                  <div className="toggle-info">
                    <strong>
                      Browser Notifications
                    </strong>

                    <p>
                      Save your browser alert preference.
                    </p>
                  </div>

                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={
                        notifications.browserAlerts
                      }
                      onChange={(e) =>
                        setNotifications({
                          ...notifications,
                          browserAlerts:
                            e.target.checked,
                        })
                      }
                    />

                    <span className="slider"></span>
                  </label>
                </div>

                {/* Offers & News */}
                <div className="toggle-item">
                  <div className="toggle-info">
                    <strong>Offers & News</strong>

                    <p>
                      Save your preference for marketing
                      emails and news.
                    </p>
                  </div>

                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={
                        notifications.emailMarketing
                      }
                      onChange={(e) =>
                        setNotifications({
                          ...notifications,
                          emailMarketing:
                            e.target.checked,
                        })
                      }
                    />

                    <span className="slider"></span>
                  </label>
                </div>
              </div>

              <div className="form-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveNotifications}
                >
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {/* ==================================================
              BILLING TAB
          ================================================== */}

          {activeTab === "billing" && (
            <div className="settings-pane">
              <div className="pane-header">
                <div>
                  <h2 className="pane-title">
                    Billing & Subscription
                  </h2>

                  <p className="pane-description">
                    Manage your payment methods and
                    subscription plans.
                  </p>
                </div>
              </div>

              {/* Current Plan */}
              <div className="plan-banner">
                <div className="plan-banner-content">
                  <span className="plan-chip">
                    CURRENT PLAN
                  </span>

                  <h3>Free Account</h3>

                  <p>
                    Standard access to publish projects and
                    contact freelancers.
                  </p>
                </div>

                <button
                  type="button"
                  className="btn btn-primary"
                  disabled
                  title="Billing and upgrades are not implemented yet"
                >
                  Upgrade to PRO
                </button>
              </div>

              {/* Payment Methods */}
              <div className="section-block">
                <h3 className="section-block-title">
                  Payment Methods
                </h3>

                <div className="payment-card">
                  <div className="payment-card-left">
                    <div className="card-brand-icon">
                      💳
                    </div>

                    <div>
                      <strong>
                        Payment methods unavailable
                      </strong>

                      <p>
                        Billing integration has not been
                        implemented yet.
                      </p>
                    </div>
                  </div>

                  <span className="badge-default">
                    Free
                  </span>
                </div>

                <button
                  type="button"
                  className="btn btn-secondary btn-sm mt-12"
                  disabled
                >
                  + Add Payment Method
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Settings;