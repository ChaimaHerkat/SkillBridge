import React from "react";
import "./Footer.css";

const Footer: React.FC = () => {
  return (
    <footer className="main-footer">
      <div className="main-footer-container">
        {/* Brand */}
        <div className="main-footer-brand">
          <div className="main-footer-logo">
            <div className="main-footer-logo-icon">SB</div>
            <span>
              Skill<span>Bridge</span>
            </span>
          </div>

          <p>
            Connect with talented freelancers and bring your projects to
            life with SkillBridge.
          </p>
        </div>

        {/* Marketplace */}
        <div className="main-footer-column">
          <h4>Marketplace</h4>
          <a href="/marketplace">Browse Projects</a>
          <a href="/freelancers">Find Freelancers</a>
          <a href="/marketplace">Categories</a>
          <a href="/dashboard/create-project">Post a Project</a>
        </div>

        {/* Company */}
        <div className="main-footer-column">
          <h4>Company</h4>
          <a href="/">About Us</a>
          <a href="/">How It Works</a>
          <a href="/">Careers</a>
          <a href="/">Contact</a>
        </div>

        {/* Support */}
        <div className="main-footer-column">
          <h4>Support</h4>
          <a href="/">Help Center</a>
          <a href="/">Terms of Service</a>
          <a href="/">Privacy Policy</a>
          <a href="/">FAQ</a>
        </div>
      </div>

      {/* Bottom */}
      <div className="main-footer-bottom">
        <span>© 2026 SkillBridge. All rights reserved.</span>

        <div className="main-footer-socials">
          <a
            href="https://github.com/ChaimaHerkat/SkillBridge"
            className="main-footer-social"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            GH
          </a>

          <a
            href="/"
            className="main-footer-social"
            aria-label="LinkedIn"
          >
            in
          </a>

          <a
            href="/"
            className="main-footer-social"
            aria-label="Twitter"
          >
            X
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;