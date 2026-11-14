import { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { recommendationAPI } from "../../services/api";

const PitchKitModal = ({ open, onClose, opportunity, answers }) => {
  const [loading, setLoading] = useState(true);
  const [kit, setKit] = useState(null);
  const [error, setError] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  useEffect(() => {
    if (!open || !opportunity?.title) return;

    setLoading(true);
    setError(null);

    recommendationAPI
      .getPitchKit({
        opportunityTitle: opportunity.title,
        category: opportunity.category,
        skills: answers?.skills || [],
      })
      .then((data) => {
        setKit(data.pitchKit);
      })
      .catch((err) => {
        console.error("Pitch kit error:", err);
        setError("Unable to generate outreach kit right now.");
      })
      .finally(() => setLoading(false));
  }, [open, opportunity?.title, answers]);

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (!opportunity?.title) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <div className="pitch-kit-content">
        <div className="pitch-kit-header">
          <span className="eyebrow-pill">
            <span className="sparkle-dot">✦</span> First Client Kit
          </span>
          <h2 className="pitch-kit-title">Outreach & Pitch Blueprint</h2>
          <p className="pitch-kit-subtitle">
            Copy-paste templates to land your first client or paid project for{" "}
            <strong>{opportunity.title}</strong> with zero ad spend.
          </p>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="analyzing-orb-wrap">
              <div className="analyzing-orb" />
            </div>
            <p className="text-muted text-sm mt-3">Crafting your custom outreach scripts...</p>
          </div>
        )}

        {error && (
          <div className="alert-box alert-error my-4">
            <p>{error}</p>
          </div>
        )}

        {!loading && kit && (
          <div className="pitch-kit-body">
            {/* Bio Tagline */}
            <div className="kit-card">
              <div className="kit-card-header">
                <span className="kit-section-label">Profile Headline / Bio Tagline</span>
                <button
                  type="button"
                  className="btn-copy-chip"
                  onClick={() => copyToClipboard(kit.tagline, "tagline")}
                >
                  {copiedKey === "tagline" ? "Copied ✓" : "Copy Tagline"}
                </button>
              </div>
              <p className="kit-tagline-text">"{kit.tagline}"</p>
            </div>

            {/* Cold Email */}
            <div className="kit-card">
              <div className="kit-card-header">
                <span className="kit-section-label">Cold Email Outreach Pitch</span>
                <button
                  type="button"
                  className="btn-copy-chip"
                  onClick={() =>
                    copyToClipboard(
                      `Subject: ${kit.coldEmail.subject}\n\n${kit.coldEmail.body}`,
                      "email"
                    )
                  }
                >
                  {copiedKey === "email" ? "Copied ✓" : "Copy Full Email"}
                </button>
              </div>
              <div className="email-subject-line">
                <span className="email-prefix">Subject:</span> {kit.coldEmail.subject}
              </div>
              <pre className="email-body-text">{kit.coldEmail.body}</pre>
            </div>

            {/* LinkedIn / DM Script */}
            <div className="kit-card">
              <div className="kit-card-header">
                <span className="kit-section-label">Short LinkedIn / Twitter DM</span>
                <button
                  type="button"
                  className="btn-copy-chip"
                  onClick={() => copyToClipboard(kit.dmScript, "dm")}
                >
                  {copiedKey === "dm" ? "Copied ✓" : "Copy DM"}
                </button>
              </div>
              <p className="dm-script-text">{kit.dmScript}</p>
            </div>

            {/* Target Prospects */}
            {kit.targetProspects?.length > 0 && (
              <div className="kit-card">
                <span className="kit-section-label">Where to Scout Ideal Leads</span>
                <ul className="prospects-list">
                  {kit.targetProspects.map((target, idx) => (
                    <li key={idx} className="prospect-item">
                      <span className="prospect-bullet">✦</span>
                      <span>{target}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tactical Pro Tip */}
            {kit.proTip && (
              <div className="copilot-pitfall-box">
                <span className="pitfall-tag">Coach's Pro Tip</span>
                <p className="pitfall-text">{kit.proTip}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default PitchKitModal;

