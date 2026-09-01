import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Register.css";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [role, setRole] = useState<"client" | "freelancer">("client");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    // Vérification du mot de passe
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    setIsLoading(true);

    try {
      await register(
        email,
        password,
        firstName,
        lastName,
        role
      );

      // Après inscription → Dashboard
      navigate("/dashboard");

    } catch (err) {
      setError(
        (err as Error).message ||
        "Registration failed."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">

      {/* =====================================================
          LEFT BRANDING
      ===================================================== */}

      <div className="register-brand">

        <div className="register-brand-content">

          {/* LOGO */}

          <div
            className="register-logo"
            onClick={() => navigate("/")}
          >
            <div className="register-logo-icon">
              S
            </div>

            <span>
              Skill<span>Bridge</span>
            </span>
          </div>


          {/* HERO TEXT */}

          <div className="register-hero-text">

            <div className="register-badge">
              ✦ JOIN SKILLBRIDGE
            </div>

            <h1>
              Build.
              <br />
              <span>Connect.</span>
              <br />
              Succeed.
            </h1>

            <p>
              Create your SkillBridge account and
              start connecting with talented
              professionals and exciting projects.
            </p>

          </div>


          {/* BENEFITS */}

          <div className="register-benefits">

            <div className="register-benefit">

              <div className="benefit-icon">
                ✓
              </div>

              <div>
                <strong>
                  Find great opportunities
                </strong>

                <span>
                  Discover projects that match your skills.
                </span>
              </div>

            </div>


            <div className="register-benefit">

              <div className="benefit-icon">
                ✓
              </div>

              <div>
                <strong>
                  Work with professionals
                </strong>

                <span>
                  Connect with talented people worldwide.
                </span>
              </div>

            </div>


            <div className="register-benefit">

              <div className="benefit-icon">
                ✓
              </div>

              <div>
                <strong>
                  Grow your career
                </strong>

                <span>
                  Build your reputation and portfolio.
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          REGISTER FORM
      ===================================================== */}

      <div className="register-form-side">

        <div className="register-container">

          {/* HEADER */}

          <div className="register-header">

            <h2>
              Create your account 🚀
            </h2>

            <p>
              Join SkillBridge and start your journey
            </p>

          </div>


          {/* ERROR */}

          {error && (
            <div className="register-error">

              <span>!</span>

              {error}

            </div>
          )}


          {/* FORM */}

          <form onSubmit={handleSubmit}>

            {/* FIRST + LAST NAME */}

            <div className="register-name-row">

              <div className="register-form-group">

                <label htmlFor="firstName">
                  First name
                </label>

                <input
                  id="firstName"
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) =>
                    setFirstName(e.target.value)
                  }
                  required
                />

              </div>


              <div className="register-form-group">

                <label htmlFor="lastName">
                  Last name
                </label>

                <input
                  id="lastName"
                  type="text"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) =>
                    setLastName(e.target.value)
                  }
                  required
                />

              </div>

            </div>


            {/* EMAIL */}

            <div className="register-form-group">

              <label htmlFor="register-email">
                Email address
              </label>

              <input
                id="register-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />

            </div>


            {/* ROLE */}

            <div className="register-form-group">

              <label>
                I want to join as
              </label>

              <div className="role-options">

                <button
                  type="button"
                  className={
                    role === "client"
                      ? "role-option selected"
                      : "role-option"
                  }
                  onClick={() => setRole("client")}
                >
                  <span className="role-icon">
                    💼
                  </span>

                  <span className="role-content">
                    <strong>Client</strong>
                    <small>
                      Hire professionals
                    </small>
                  </span>

                </button>


                <button
                  type="button"
                  className={
                    role === "freelancer"
                      ? "role-option selected"
                      : "role-option"
                  }
                  onClick={() =>
                    setRole("freelancer")
                  }
                >
                  <span className="role-icon">
                    ✨
                  </span>

                  <span className="role-content">
                    <strong>Freelancer</strong>
                    <small>
                      Find projects
                    </small>
                  </span>

                </button>

              </div>

            </div>


            {/* PASSWORD */}

            <div className="register-form-group">

              <label htmlFor="register-password">
                Password
              </label>

              <input
                id="register-password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />

            </div>


            {/* CONFIRM PASSWORD */}

            <div className="register-form-group">

              <label htmlFor="confirm-password">
                Confirm password
              </label>

              <input
                id="confirm-password"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                required
              />

            </div>


            {/* TERMS */}

            <div className="register-terms">

              <input
                type="checkbox"
                id="terms"
                required
              />

              <label htmlFor="terms">
                I agree to the{" "}
                <button type="button">
                  Terms of Service
                </button>{" "}
                and{" "}
                <button type="button">
                  Privacy Policy
                </button>
              </label>

            </div>


            {/* SUBMIT */}

            <button
              type="submit"
              className="register-submit"
              disabled={isLoading}
            >

              {isLoading ? (
                <>
                  <span className="register-spinner"></span>

                  Creating account...
                </>
              ) : (
                <>
                  Create Account

                  <span>→</span>
                </>
              )}

            </button>

          </form>


          {/* LOGIN */}

          <div className="register-login">

            <span>
              Already have an account?
            </span>

            <button
              type="button"
              onClick={() => navigate("/login")}
            >
              Sign in
            </button>

          </div>


          {/* SECURITY */}

          <div className="register-security">
            🔒 Your information is protected and secure.
          </div>

        </div>

      </div>

    </div>
  );
};

export default Register;