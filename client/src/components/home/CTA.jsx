import { useNavigate } from 'react-router-dom';
import Section from '../ui/Section';
import Button from '../ui/Button';

const CTA = () => {
  const navigate = useNavigate();

  return (
    <Section background="primary" className="cta">
      <h2>Ready to find your income path?</h2>
      <p>Answer a few quick questions and get a personalized roadmap in minutes.</p>
      <Button size="lg" variant="secondary" onClick={() => navigate('/assessment')}>
        Start Discovery →
      </Button>
    </Section>
  );
};

export default CTA;