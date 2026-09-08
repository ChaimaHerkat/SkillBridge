import React from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

const Header: React.FC = () => {
  const navigate = useNavigate();

  const goToSection = (sectionId: string) => {
    // Si on est déjà sur Home
    if (window.location.pathname === "/") {
      const section = document.getElementById(sectionId);

      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    } 
    // Si on est sur une autre page
    else {
      navigate(`/#${sectionId}`);
    }
  };

  const goHome = () => {
    if (window.location.pathname === "/") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      navigate("/");
    }
  };

  return (
    <header className="main-header">

      <div className="main-header-container">

        {/* LOGO */}

        <div
          className="main-header-logo"
          onClick={goHome}
        >
          <div className="main-header-logo-icon">
            SB
          </div>

          <span>
            Skill<span>Bridge</span>
          </span>
        </div>


        {/* NAVIGATION */}

        <nav className="main-header-nav">

          <button
            type="button"
            onClick={goHome}
          >
            Home
          </button>

          <button
            type="button"
            onClick={() => goToSection("categories")}
          >
            Categories
          </button>

          <button
            type="button"
            onClick={() => goToSection("freelancers")}
          >
            Freelancers
          </button>

          <button
            type="button"
            onClick={() => goToSection("how-it-works")}
          >
            How It Works
          </button>

        </nav>


        {/* ACTIONS */}

        <div className="main-header-actions">

          <button
            type="button"
            className="main-header-login"
            onClick={() => navigate("/login")}
          >
            Log In
          </button>

          <button
            type="button"
            className="main-header-signup"
            onClick={() => navigate("/register")}
          >
            Get Started
          </button>

        </div>

      </div>

    </header>
  );
};

export default Header;