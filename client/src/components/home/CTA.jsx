import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";

const CTA = () => {
  const navigate = useNavigate();

  return (
    <section className="section-padded">
      <div className="section-wrap">
        <div className="cta-bezel double-bezel">
          <div className="double-bezel-inner cta-inner text-center">
            <span className="eyebrow-pill">Start Your Journey</span>
            <h2 className="cta-title">Ready to discover your path?</h2>
            <p className="cta-lead">
              Answer 13 quick questions about your schedule, current skills, and
              budget to generate your tailored 5-step roadmap.
            </p>

            <div className="cta-action-center">
              <Button
                size="lg"
                variant="primary"
                onClick={() => navigate("/assessment")}
                className="cta-btn"
              >
                <span>Launch Assessment Now</span>
                <span className="btn-icon-island">↗</span>
              </Button>
            </div>

            <span className="cta-meta">
              Free to use · No credit card required · Instant recommendations
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
