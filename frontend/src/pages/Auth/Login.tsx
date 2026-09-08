import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError((err as Error).message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* ================= LEFT BRANDING ================= */}

      <div className="login-brand">

        <div className="login-brand-content">

          <div
            className="login-logo"
            onClick={() => navigate("/")}
          >
            <div className="login-logo-icon">S</div>
            <span>
              Skill<span>Bridge</span>
            </span>
          </div>

          <div className="login-hero-text">
            <div className="login-badge">
              ✦ WELCOME BACK
            </div>

            <h1>
              Connect.
              <br />
              <span>Collaborate.</span>
              <br />
              Grow.
            </h1>

            <p>
              Sign in to continue connecting with talented
              professionals and discovering new opportunities.
            </p>
          </div>

          <div className="login-stats">

            <div>
              <strong>10K+</strong>
              <span>Professionals</span>
            </div>

            <div>
              <strong>5K+</strong>
              <span>Projects</span>
            </div>

            <div>
              <strong>98%</strong>
              <span>Satisfaction</span>
            </div>

          </div>

        </div>

      </div>

      {/* ================= LOGIN FORM ================= */}

      <div className="login-form-side">

        <div className="login-container">

          <div className="login-header">

            <h2>Welcome back 👋</h2>

            <p>
              Sign in to your SkillBridge account
            </p>

          </div>

          {error && (
            <div className="error-message">
              <span>!</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* EMAIL */}

            <div className="form-group">

              <label htmlFor="email">
                Email address
              </label>

              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

            </div>

            {/* PASSWORD */}

            <div className="form-group">

              <div className="password-label">

                <label htmlFor="password">
                  Password
                </label>

                <a href="#">
                  Forgot password?
                </a>

              </div>

              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

            </div>

            {/* SUBMIT */}

            <button
              type="submit"
              className="login-submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="login-spinner"></span>
                  Logging in...
                </>
              ) : (
                <>
                  Sign In
                  <span>→</span>
                </>
              )}
            </button>

          </form>

          {/* REGISTER */}

          <div className="login-register">

            <span>
              Don't have an account?
            </span>

            <button
              type="button"
              onClick={() => navigate("/register")}
            >
              Create an account
            </button>

          </div>

          <div className="login-divider">
            <span>Secure access to SkillBridge</span>
          </div>

          <div className="login-security">
            🔒 Your information is protected and secure.
          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;