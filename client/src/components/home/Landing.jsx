import { useNavigate, Link } from "react-router-dom";
import Button from "../ui/Button";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <section className="hero-section">
      <div className="hero-wrap">
        <div className="hero-grid">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="hero-content">
            <div className="hero-eyebrow-wrapper">
              <span className="eyebrow-pill">
                <span className="sparkle-dot">✦</span> AI-Guided Income Matching
              </span>
            </div>

            <h1 className="hero-headline">
              Turn what you know into <span className="headline-gradient">how you earn.</span>
            </h1>

            <p className="hero-lead">
              Get an actionable, realistic business or freelance roadmap in three
              minutes — calibrated to your exact daily hours, current skills, and
              budget constraints.
            </p>

            <div className="hero-actions-cluster">
              <Button
                size="lg"
                variant="primary"
                onClick={() => navigate("/assessment")}
                className="hero-primary-btn"
              >
                <span>Discover Your Path</span>
                <span className="btn-icon-island">↗</span>
              </Button>

              <Button
                size="lg"
                variant="secondary"
                as={Link}
                to="/recommendation"
                className="hero-secondary-btn"
              >
                Explore Sample Matches
              </Button>
            </div>

            <div className="hero-social-proof">
              <div className="avatar-stack">
                <span className="mini-avatar avatar-1">A</span>
                <span className="mini-avatar avatar-2">R</span>
                <span className="mini-avatar avatar-3">P</span>
                <span className="mini-avatar avatar-4">M</span>
              </div>
              <span className="proof-text">
                Designed for students, career switchers & solo builders
              </span>
            </div>
          </div>

          {/* Right Column: Double-Bezel Live Product Mockup */}
          <div className="hero-visual">
            <div className="hero-card-bezel double-bezel">
              <div className="double-bezel-inner hero-card-inner">
                {/* Mock Card Header */}
                <div className="mock-card-header">
                  <div className="mock-badges">
                    <span className="badge-featured">Top Match · 96% Fit</span>
                    <span className="badge-category">Technical Writing & Research</span>
                  </div>
                  <div className="mock-live-indicator">
                    <span className="live-pulse" />
                    <span>Real AI Recommendation</span>
                  </div>
                </div>

                <h3 className="mock-title">SaaS Documentation Specialist</h3>
                <p className="mock-description">
                  Creates clear knowledge-base articles and product guides for growing software startups. Zero startup capital required.
                </p>

                {/* Metrics */}
                <div className="mock-metrics-grid">
                  <div className="mock-metric-cell">
                    <span className="metric-label">Initial Investment</span>
                    <span className="metric-value">₹0 (Zero capital)</span>
                  </div>
                  <div className="mock-metric-cell">
                    <span className="metric-label">Estimated Yield</span>
                    <span className="metric-value">₹25,000 - ₹55,000/mo</span>
                  </div>
                  <div className="mock-metric-cell">
                    <span className="metric-label">Time to 1st Dollar</span>
                    <span className="metric-value">2 - 3 Weeks</span>
                  </div>
                </div>

                {/* Milestone Step Preview */}
                <div className="mock-steps-preview">
                  <div className="mock-step-row is-active">
                    <span className="mock-step-num">01</span>
                    <span className="mock-step-text">Audit 3 open-source docs & craft sample guides</span>
                  </div>
                  <div className="mock-step-row">
                    <span className="mock-step-num">02</span>
                    <span className="mock-step-text">Set up single-page proof-of-work portfolio</span>
                  </div>
                  <div className="mock-step-row">
                    <span className="mock-step-num">03</span>
                    <span className="mock-step-text">Direct outreach to early-stage founder directories</span>
                  </div>
                </div>

                <div className="mock-action-row">
                  <span className="mock-footnote">Matched from 13 user constraints</span>
                  <button
                    type="button"
                    className="mock-inline-cta"
                    onClick={() => navigate("/assessment")}
                  >
                    Generate yours →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Landing;
