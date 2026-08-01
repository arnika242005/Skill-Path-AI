import Section from '../ui/Section';
import Card from '../ui/Card';

const steps = [
  { step: '01', title: 'Tell us about yourself', desc: 'Share your interests, skills, budget, and goals in a quick assessment.' },
  { step: '02', title: 'AI analyzes your profile', desc: 'Our engine matches your profile against real income opportunities.' },
  { step: '03', title: 'Get a realistic roadmap', desc: 'Receive a step-by-step plan with costs, timelines, and skill gaps.' },
];

const HowItWorks = () => {
  return (
    <Section background="muted">
      <h2 className="section-heading">How it works</h2>
      <div className="how-grid">
        {steps.map((s) => (
          <Card key={s.step} hover className="how-card">
            <span className="how-step">{s.step}</span>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
};

export default HowItWorks;