import Card from '../ui/Card';
import Button from '../ui/Button';
import MatchScore from './MatchScore';

const OpportunityCard = ({ opportunity, featured = false, onViewRoadmap }) => {
  const { title, matchScore, why, startupCost, earningPotential } = opportunity;

  return (
    <Card hover className={`opportunity-card ${featured ? 'featured' : ''}`}>
      {featured && <span className="opportunity-badge">Best Match</span>}

      <div className="opportunity-top">
        <div>
          <h3>{title}</h3>
          <p className="opportunity-why">{why}</p>
        </div>
        <MatchScore score={matchScore} />
      </div>

      <div className="opportunity-stats">
        <div>
          <span className="stat-label">Startup Cost</span>
          <span className="stat-value">{startupCost}</span>
        </div>
        <div>
          <span className="stat-label">Earning Potential</span>
          <span className="stat-value">{earningPotential}</span>
        </div>
      </div>

      <Button variant={featured ? 'primary' : 'outline'} onClick={() => onViewRoadmap(opportunity)}>
        View Roadmap →
      </Button>
    </Card>
  );
};

export default OpportunityCard;