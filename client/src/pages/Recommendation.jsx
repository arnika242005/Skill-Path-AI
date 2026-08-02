import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Container from '../components/ui/Container';
import ProfileSummary from '../components/recommendation/ProfileSummary';
import OpportunityCard from '../components/recommendation/OpportunityCard';
import { recommendationAPI } from "../services/api";

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
      <Navbar />
      <Container size="md" className="recommendation">
        <h2>Hi there 👋</h2>
        <p className="recommendation-subtitle">
          Based on your interests, skills, budget, and availability, we found the best opportunities for you.
        </p>

        <ProfileSummary answers={answers} />

        {featured && <OpportunityCard opportunity={featured} featured onViewRoadmap={handleViewRoadmap} />}

        {rest.map((opp) => (
          <OpportunityCard key={opp.id} opportunity={opp} onViewRoadmap={handleViewRoadmap} />
        ))}
      </Container>
      <Footer />
    </>
  );
};

export default Recommendation;