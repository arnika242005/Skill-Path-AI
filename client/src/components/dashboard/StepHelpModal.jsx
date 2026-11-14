import { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { recommendationAPI } from "../../services/api";

const StepHelpModal = ({ open, onClose, step, opportunityTitle }) => {
  const [loading, setLoading] = useState(true);
  const [helpData, setHelpData] = useState(null);
  const [error, setError] = useState(null);
  const [customQuestion, setCustomQuestion] = useState("");
  const [customLoading, setCustomLoading] = useState(false);

  useEffect(() => {
    if (!open || !step) return;

    setLoading(true);
    setError(null);
    setCustomQuestion("");

    recommendationAPI
      .getStepHelp({
        stepTitle: step.title,
        stepDescription: step.description,
        opportunityTitle,
      })
      .then((data) => {
        setHelpData(data.help);
      })
      .catch((err) => {
        console.error("Step help error:", err);
        setError("Unable to load step guidance. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [open, step, opportunityTitle]);

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!customQuestion.trim()) return;

    setCustomLoading(true);
    try {
      const data = await recommendationAPI.getStepHelp({
        stepTitle: step.title,
        stepDescription: step.description,
        opportunityTitle,
        userQuestion: customQuestion,
      });
      setHelpData(data.help);
      setCustomQuestion("");
    } catch (err) {
      console.warn("Custom question error:", err);
    } finally {
      setCustomLoading(false);
    }
  };

  if (!step) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <div className="copilot-modal-content">
        <div className="copilot-header">
          <span className="eyebrow-pill">
            <span className="sparkle-dot">✦</span> Step Copilot & Mentor
          </span>
          <h2 className="copilot-step-title">{step.title}</h2>
          <p className="copilot-step-desc">{step.description}</p>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="analyzing-orb-wrap">
              <div className="analyzing-orb" />
            </div>
            <p className="text-muted text-sm mt-3">Synthesizing zero-cost action plan...</p>
          </div>
        )}

        {error && (
          <div className="alert-box alert-error my-4">
            <p>{error}</p>
          </div>
        )}

        {!loading && helpData && (
          <div className="copilot-body-stack">
            {/* TL;DR Quick Track */}
            <div className="copilot-tldr-box">
              <span className="tldr-label">The Fast Track</span>
              <p className="tldr-text">{helpData.tldr}</p>
            </div>

            {/* Action Items */}
            <div className="copilot-section">
              <h4 className="copilot-section-heading">Immediate Action Items</h4>
              <ul className="copilot-action-list">
                {helpData.actionItems?.map((item, idx) => (
                  <li key={idx} className="copilot-action-item">
                    <span className="action-step-num">0{idx + 1}</span>
                    <span className="action-step-text">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Free Tool Stack */}
            {helpData.freeTools?.length > 0 && (
              <div className="copilot-section">
                <h4 className="copilot-section-heading">Zero-Cost Tool Stack</h4>
                <div className="copilot-tools-grid">
                  {helpData.freeTools.map((tool, idx) => (
                    <div key={idx} className="tool-chip">
                      <strong className="tool-name">{tool.name}</strong>
                      <span className="tool-purpose">{tool.purpose}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trap Warning */}
            {helpData.pitfallToAvoid && (
              <div className="copilot-pitfall-box">
                <span className="pitfall-tag">Common Trap to Avoid</span>
                <p className="pitfall-text">{helpData.pitfallToAvoid}</p>
              </div>
            )}

            {/* Custom Question Ask */}
            <form onSubmit={handleAskQuestion} className="copilot-ask-form">
              <label className="input-label">Still stuck or have a question?</label>
              <div className="copilot-input-cluster">
                <input
                  type="text"
                  className="input-control"
                  placeholder="e.g. How do I find free sample datasets?"
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  disabled={customLoading}
                />
                <Button variant="primary" size="sm" type="submit" disabled={customLoading || !customQuestion.trim()}>
                  {customLoading ? "Asking..." : "Ask"}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default StepHelpModal;

