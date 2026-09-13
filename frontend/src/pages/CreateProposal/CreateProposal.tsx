import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import proposalService from "../../services/proposalService";
import { useAuth } from "../../context/AuthContext";
import "./CreateProposal.css";

const CreateProposal: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [coverLetter, setCoverLetter] = useState("");
  const [proposedBudget, setProposedBudget] = useState<number | "">("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    navigate("/login");
    return null;
  }

  if (user.role !== "FREELANCER") {
    navigate("/marketplace");
    return null;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!id) {
      setError("Project not found.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await proposalService.createProposal({
        project: Number(id),
        cover_letter: coverLetter,
        proposed_budget:
          proposedBudget === "" ? 0 : proposedBudget,
        delivery_time: deliveryTime,
      });

      navigate(`/marketplace/${id}`);
    } catch (err: any) {
      setError(err?.message || "Failed to submit proposal.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-proposal-page">
      <main>
        <section className="create-proposal-hero">
          <div className="create-proposal-container">
            <div className="create-proposal-heading">
              <span className="create-proposal-label">
                SKILLBRIDGE FOR FREELANCERS
              </span>

              <h1>Submit a Proposal</h1>

              <p>
                Introduce yourself, explain how you can help, and
                send a proposal that matches the client's needs.
              </p>
            </div>
          </div>
        </section>

        <section className="create-proposal-section">
          <div className="create-proposal-container">
            <div className="create-proposal-card">
              <div className="create-proposal-card-header">
                <span className="create-proposal-small-label">
                  YOUR PROPOSAL
                </span>

                <h2>Tell the client why you're a good fit</h2>

                <p>
                  Provide a clear proposal with your approach,
                  budget, and expected delivery time.
                </p>
              </div>

              {error && (
                <div className="create-proposal-error">
                  <span>!</span>
                  <p>{error}</p>
                </div>
              )}

              <form
                className="create-proposal-form"
                onSubmit={handleSubmit}
              >
                <div className="create-proposal-field full">
                  <label htmlFor="cover-letter">
                    Cover letter
                    <span>*</span>
                  </label>

                  <textarea
                    id="cover-letter"
                    value={coverLetter}
                    onChange={(event) =>
                      setCoverLetter(event.target.value)
                    }
                    placeholder="Introduce yourself, describe your experience, explain your approach, and tell the client why you are a good fit for this project..."
                    required
                  />

                  <small>
                    Keep your message professional and relevant
                    to the project.
                  </small>
                </div>

                <div className="create-proposal-form-grid">
                  <div className="create-proposal-field">
                    <label htmlFor="proposed-budget">
                      Proposed budget
                      <span>*</span>
                    </label>

                    <input
                      id="proposed-budget"
                      type="number"
                      min="0"
                      value={proposedBudget}
                      onChange={(event) =>
                        setProposedBudget(
                          event.target.value === ""
                            ? ""
                            : Number(event.target.value)
                        )
                      }
                      placeholder="e.g. 750"
                      required
                    />
                  </div>

                  <div className="create-proposal-field">
                    <label htmlFor="delivery-time">
                      Delivery time
                      <span>*</span>
                    </label>

                    <input
                      id="delivery-time"
                      type="text"
                      value={deliveryTime}
                      onChange={(event) =>
                        setDeliveryTime(event.target.value)
                      }
                      placeholder="e.g. 10 days"
                      required
                    />
                  </div>
                </div>

                <div className="create-proposal-divider" />

                <div className="create-proposal-actions">
                  <button
                    type="button"
                    className="create-proposal-cancel"
                    onClick={() =>
                      navigate(`/marketplace/${id}`)
                    }
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="create-proposal-submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="create-proposal-spinner" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Submit Proposal
                        <span>→</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CreateProposal;