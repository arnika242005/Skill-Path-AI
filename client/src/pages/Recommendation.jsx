import { useLocation, useNavigate } from 'react-router-dom';
import Container from '../components/ui/Container';
import ProfileSummary from '../components/recommendation/ProfileSummary';
import OpportunityCard from '../components/recommendation/OpportunityCard';

const Recommendation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const answers = location.state?.answers || {};
  const recommendations = location.state?.recommendations || [];

  const [featured, ...rest] = recommendations;

  const handleViewRoadmap = (opportunity) => {
    navigate('/dashboard', { state: { opportunity, answers } });
  };

  return (
    <>
      <Container size="md" className="recommendation">
        <h2>Hi there!</h2>
        <p className="recommendation-subtitle">
          Based on your interests, skills, budget, and availability, we found the best opportunities for you.
        </p>

        <ProfileSummary answers={answers} />

        {featured && <OpportunityCard opportunity={featured} featured onViewRoadmap={handleViewRoadmap} />}

        {rest.map((opp) => (
          <OpportunityCard key={opp.id} opportunity={opp} onViewRoadmap={handleViewRoadmap} />
        ))}
      </Container>
    </>
  );
};

export default Recommendation;