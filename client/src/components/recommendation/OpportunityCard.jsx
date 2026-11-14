import Button from "../ui/Button";
import MatchScore from "./MatchScore";

const OpportunityCard = ({ opportunity, featured = false, onViewRoadmap }) => {
  const {
    title = "Income Path",
    category = "General",
    matchScore = 88,
    why = "",
    startupCost = "₹0",
    earningPotential = "₹15k - ₹40k/mo",
  } = opportunity;

  return (
    <div className={`opportunity-bezel ${featured ? "is-featured" : ""}`}>
      <div className="opportunity-inner">
        <div className="opportunity-top-row">
          <div className="opportunity-headings">
            <div className="opportunity-badges">
              {featured && <span className="badge-featured">Top Match · #1</span>}
              <span className="badge-category">{category}</span>
            </div>
            <h3 className="opportunity-title">{title}</h3>
          </div>

          <div className="opportunity-score-wrapper">
            <MatchScore score={matchScore} />
          </div>
        </div>

        <p className="opportunity-reason">{why}</p>

        <div className="opportunity-metrics-strip">
          <div className="metric-cell">
            <span className="metric-label">Initial Capital</span>
            <span className="metric-value">{startupCost}</span>
          </div>
          <div className="metric-divider" />
          <div className="metric-cell">
            <span className="metric-label">Earning Target</span>
            <span className="metric-value">{earningPotential}</span>
          </div>
        </div>

        <div className="opportunity-action-row">
          <Button
            variant={featured ? "primary" : "secondary"}
            onClick={() => onViewRoadmap(opportunity)}
            className="w-full justify-between"
          >
            <span>View Step-by-Step Roadmap</span>
            <span className="btn-icon-island">↗</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OpportunityCard;
