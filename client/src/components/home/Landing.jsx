import { useNavigate } from 'react-router-dom';
import Section from '../ui/Section';
import Button from '../ui/Button';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <Section className="landing">
      <div className="landing-grid">
        <div className="landing-content">
          <h1>Discover income paths built for your skills</h1>
          <p className="landing-subtitle">
            Turn your interests into real income opportunities. Get a personalized
            business or income path in minutes — matched to your skills, budget, and goals.
          </p>
          <Button size="lg" onClick={() => navigate('/assessment')}>
            Start Discovering →
          </Button>
        </div>
        <div className="landing-image">
          <img src="/assets/images/hero.png" alt="Discover your income path" />
        </div>
      </div>
    </Section>
  );
};

export default Landing;