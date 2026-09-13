import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import proposalService from "../../services/proposalService";
import type { Proposal } from "../../services/proposalService";
import "./Proposals.css";

const Proposals: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const loadProposals = async () => {
      try {
        const data = await proposalService.getProposals();
        setProposals(data);
      } catch (error) {
        console.error("Failed to load proposals:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProposals();
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="proposals-page">

      {/* =====================================================
          HEADER
          ===================================================== */}

      <header className="proposals-header">

        <button
          className="back-button"
          onClick={() => navigate("/dashboard")}
        >
          ← Dashboard
        </button>

        <div className="proposals-user">

          <div className="proposals-user-info">
            <strong>
              {user.firstName} {user.lastName}
            </strong>

            <span>
              Freelancer
            </span>
          </div>

          <div className="proposals-avatar">
            {user.firstName?.charAt(0).toUpperCase()}
          </div>

        </div>

      </header>


      {/* =====================================================
          MAIN
          ===================================================== */}

      <main className="proposals-main">

        {/* Page title */}

        <section className="proposals-title">

          <div className="proposals-title-content">

            <span className="proposals-label">
              FREELANCER SPACE
            </span>

            <h1>
              My Proposals
            </h1>

            <p>
              Track and manage the proposals you have submitted.
            </p>

          </div>

          <div className="proposal-count">

            <strong>
              {proposals.length}
            </strong>

            <span>
              Proposals
            </span>

          </div>

        </section>


        {/* =====================================================
            LOADING
            ===================================================== */}

        {isLoading && (

          <div className="proposals-empty">

            <div className="proposals-empty-icon">
              ⏳
            </div>

            <h3>
              Loading proposals...
            </h3>

            <p>
              We are loading your submitted proposals.
            </p>

          </div>

        )}


        {/* =====================================================
            EMPTY STATE
            ===================================================== */}

        {!isLoading && proposals.length === 0 && (

          <div className="proposals-empty">

            <div className="proposals-empty-icon">
              📄
            </div>

            <h3>
              No proposals yet
            </h3>

            <p>
              You haven't submitted any proposals yet.
              Explore the marketplace and find your next opportunity.
            </p>

            <button
              className="browse-projects-button"
              onClick={() => navigate("/marketplace")}
            >
              Browse Projects →
            </button>

          </div>

        )}


        {/* =====================================================
            PROPOSALS LIST
            ===================================================== */}

        {!isLoading && proposals.length > 0 && (

          <div className="proposals-list">

            {proposals.map((proposal) => (

              <article
                className="proposal-card"
                key={proposal.id}
              >

                {/* Icon */}

                <div className="proposal-icon">
                  📄
                </div>


                {/* Content */}

                <div className="proposal-content">

                  <h3>
                    {proposal.project_title}
                  </h3>

                  <p className="proposal-description">
                    {proposal.cover_letter}
                  </p>

                  <div className="proposal-meta">

                    <span>
                      💰 {proposal.proposed_budget}
                    </span>

                    <span>
                      ⏱ {proposal.delivery_time}
                    </span>

                    <span
                      className={`proposal-status ${proposal.status}`}
                    >
                      {proposal.status}
                    </span>

                  </div>

                </div>


                {/* Actions */}

                <div className="proposal-actions">

                  <button
                    onClick={() =>
                      navigate(
                        `/marketplace/${proposal.project}`
                      )
                    }
                  >
                    View Project →
                  </button>

                </div>

              </article>

            ))}

          </div>

        )}

      </main>

    </div>
  );
};

export default Proposals;