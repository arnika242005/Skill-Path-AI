import { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import Container from "../components/ui/Container";
import Button from "../components/ui/Button";
import RoadmapStep from "../components/dashboard/RoadmapStep";
import AuthPromptModal from "../components/auth/AuthPromptModal";
import StepHelpModal from "../components/dashboard/StepHelpModal";
import PitchKitModal from "../components/dashboard/PitchKitModal";
import { useAuth } from "../context/AuthContext";
import { recommendationAPI, progressAPI, pdfAPI } from "../services/api";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [selectedHelpStep, setSelectedHelpStep] = useState(null);
  const [showPitchKit, setShowPitchKit] = useState(false);

  const stored = JSON.parse(
    sessionStorage.getItem("currentRoadmap") || "{}"
  );

  const opportunity =
    location.state?.opportunity ||
    stored.opportunity ||
    {};

  const answers =
    location.state?.answers ||
    stored.answers ||
    {};

  const [roadmapSteps, setRoadmapSteps] = useState(
    location.state?.roadmap ||
    stored.roadmap ||
    []
  );

  const [progressId, setProgressId] = useState(
    location.state?.opportunity?.progressId || location.state?.progressId || null
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(Boolean(progressId));
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");

  const hasOpportunity = Boolean(opportunity.title || progressId);

  useEffect(() => {
    // 1. Opening an existing saved roadmap from Firestore
    if (progressId) {
      setLoading(true);
      progressAPI
        .getById(progressId)
        .then((data) => {
          if (data.progress) {
            setRoadmapSteps(data.progress.roadmap || []);
            setSaved(true);
          }
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
      return;
    }

    // 2. No opportunity selected
    if (!opportunity.title) {
      setLoading(false);
      return;
    }

    // 3. Roadmap already generated and cached in state/session
    if (location.state?.roadmap?.length || stored.roadmap?.length) {
      setRoadmapSteps(location.state?.roadmap || stored.roadmap);
      setLoading(false);
      return;
    }

    // 4. Generate fresh roadmap from AI service
    setLoading(true);
    recommendationAPI
      .getRoadmap({
        opportunity,
        answers,
      })
      .then((data) => {
        setRoadmapSteps(data.roadmap || []);
        sessionStorage.setItem(
          "currentRoadmap",
          JSON.stringify({
            opportunity,
            answers,
            roadmap: data.roadmap,
          })
        );
      })
      .catch((err) => setError(err.message || "Failed to generate roadmap"))
      .finally(() => setLoading(false));
  }, [progressId, opportunity.title]);

  const handleSave = async () => {
    if (!isAuthenticated || !user?.uid) {
      sessionStorage.setItem(
        "currentRoadmap",
        JSON.stringify({
          opportunity,
          answers,
          roadmap: roadmapSteps,
        })
      );
      sessionStorage.setItem(
        "pendingAction",
        JSON.stringify({ action: "save" })
      );
      setShowAuthPrompt(true);
      return;
    }

    setSaving(true);
    try {
      const data = await progressAPI.save({
        userId: user.uid,
        opportunity,
        roadmap: roadmapSteps,
      });

      if (data.progress?._id) {
        setProgressId(data.progress._id);
        setSaved(true);
      }
    } catch (err) {
      console.error("Save roadmap error:", err);
      setError(err.message || "Could not save roadmap to your account.");
    } finally {
      setSaving(false);
    }
  };

  const toggleStep = async (index) => {
    const updated = [...roadmapSteps];
    if (!updated[index]) return;

    updated[index].done = !updated[index].done;
    setRoadmapSteps(updated);

    // If authenticated and saved in Firestore, persist progress
    if (progressId) {
      try {
        await progressAPI.updateStep({
          progressId,
          stepIndex: index,
          done: updated[index].done,
          roadmap: updated,
        });
      } catch (err) {
        console.warn("Step progress sync failed:", err);
      }
    }
  };

  const handleDownloadPDF = async () => {
    if (!roadmapSteps.length) return;
    setDownloading(true);

    try {
      const blob = await pdfAPI.downloadRoadmap(
        opportunity.title || "SkillPath",
        roadmapSteps
      );

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${(opportunity.title || "roadmap").replace(/\s+/g, "_")}_roadmap.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF download error:", err);
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  if (!hasOpportunity) {
    return (
      <div className="page-shell">
        <Container size="sm" className="empty-state-container double-bezel">
          <div className="double-bezel-inner text-center">
            <span className="eyebrow-pill">Roadmap Planner</span>
            <h2 className="empty-title">No Roadmap Selected</h2>
            <p className="empty-subtitle">
              Start by taking our assessment or explore curated income
              recommendations to generate an actionable step-by-step roadmap.
            </p>
            <div className="empty-actions-row">
              <Button as={Link} to="/assessment" variant="primary">
                <span>Start Assessment</span>
                <span className="btn-icon-island">↗</span>
              </Button>
              <Button as={Link} to="/profile" variant="secondary">
                View Saved Roadmaps
              </Button>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  const completedCount = roadmapSteps.filter((s) => s.done).length;
  const progressPercent = roadmapSteps.length
    ? Math.round((completedCount / roadmapSteps.length) * 100)
    : 0;

  return (
    <div className="page-shell">
      <Container size="md" className="dashboard-page">
        {/* Roadmap Title & Action Bar */}
        <div className="dashboard-header double-bezel">
          <div className="double-bezel-inner dashboard-header-inner">
            <div className="dashboard-header-text">
              <div className="dashboard-badges">
                <span className="eyebrow-pill">Interactive Milestone Roadmap</span>
                {opportunity.category && (
                  <span className="badge-category">{opportunity.category}</span>
                )}
              </div>
              <h1 className="dashboard-title">{opportunity.title || "Your Customized Plan"}</h1>
              <p className="dashboard-subtitle">
                {opportunity.why || "Step-by-step milestones to launch your income path."}
              </p>
            </div>

            <div className="dashboard-actions">
              {/* Feature 2: First Client Kit Trigger */}
              <Button
                variant="secondary"
                onClick={() => setShowPitchKit(true)}
                className="btn-pitch-trigger"
                title="Generate cold email and DM scripts to land your first client"
              >
                <span className="sparkle-dot">✦</span>
                <span>First Client Kit</span>
                <span className="btn-icon-island">✉</span>
              </Button>

              <Button
                variant="secondary"
                onClick={handleDownloadPDF}
                disabled={loading || downloading || !roadmapSteps.length}
                className="btn-download"
              >
                <span>{downloading ? "Preparing..." : "Export PDF"}</span>
                <span className="btn-icon-island">↓</span>
              </Button>

              <Button
                variant={saved ? "ghost" : "primary"}
                onClick={handleSave}
                disabled={saving || (saved && Boolean(progressId))}
                className="btn-save"
              >
                <span>{saved ? "Saved ✓" : saving ? "Saving..." : "Save Plan"}</span>
                {!saved && <span className="btn-icon-island">★</span>}
              </Button>
            </div>
          </div>
        </div>

        {/* Progress Tracker Card */}
        <div className="dashboard-progress-strip double-bezel">
          <div className="double-bezel-inner progress-strip-inner">
            <div className="progress-strip-info">
              <span className="progress-strip-label">Overall Completion</span>
              <span className="progress-strip-numbers">
                <strong>{completedCount}</strong> of {roadmapSteps.length} milestones complete ({progressPercent}%)
              </span>
            </div>

            <div className="progress-track-wrapper">
              <div
                className="progress-fluid-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Loading / Error States */}
        {loading && (
          <div className="roadmap-loading-state text-center py-12">
            <div className="analyzing-orb-wrap">
              <div className="analyzing-orb" />
            </div>
            <p className="text-muted mt-4">Generating your actionable milestones from AI...</p>
          </div>
        )}

        {error && (
          <div className="alert-box alert-error my-6">
            <p>{error}</p>
          </div>
        )}

        {/* Step Milestones */}
        {!loading && (
          <div className="roadmap-steps-stack">
            <div className="roadmap-instructions-bar">
              <div className="instructions-left">
                <span className="info-dot" />
                <span>Click on any milestone to mark it completed.</span>
              </div>
              <div className="instructions-right">
                <span className="text-muted text-xs">Stuck? Click "Ask Copilot" on any step for instant help.</span>
              </div>
            </div>

            {roadmapSteps.map((step, index) => (
              <RoadmapStep
                key={index}
                index={index + 1}
                title={step.title}
                description={step.description}
                done={step.done}
                onToggle={() => toggleStep(index)}
                onAskHelp={(s) => setSelectedHelpStep(s)}
              />
            ))}
          </div>
        )}

        {/* Unauthenticated Guest Banner */}
        {!loading && !isAuthenticated && roadmapSteps.length > 0 && (
          <div className="guest-unlock-card double-bezel mt-8">
            <div className="double-bezel-inner text-center">
              <span className="eyebrow-pill">Cloud Progress Sync</span>
              <h3 className="guest-title">Save your progress across devices</h3>
              <p className="guest-subtitle">
                Create a free account to store this roadmap, mark completed
                steps, and access your milestones from any phone or computer.
              </p>
              <Button
                variant="primary"
                onClick={() => setShowAuthPrompt(true)}
                className="mt-4"
              >
                <span>Save Roadmap to Free Account</span>
                <span className="btn-icon-island">↗</span>
              </Button>
            </div>
          </div>
        )}
      </Container>

      {/* Feature 1: "I'm Stuck" Step Copilot Modal */}
      <StepHelpModal
        open={Boolean(selectedHelpStep)}
        onClose={() => setSelectedHelpStep(null)}
        step={selectedHelpStep}
        opportunityTitle={opportunity.title || "Career Path"}
      />

      {/* Feature 2: First Client Kit Modal */}
      <PitchKitModal
        open={showPitchKit}
        onClose={() => setShowPitchKit(false)}
        opportunity={opportunity}
        answers={answers}
      />

      <AuthPromptModal
        open={showAuthPrompt}
        onClose={() => setShowAuthPrompt(false)}
      />
    </div>
  );
};

export default Dashboard;
