import Section from '../ui/Section';

const points = [
  { title: 'Personalized matches', desc: 'Suggestions based on your unique profile.' },
  { title: 'Realistic opportunities', desc: 'Actually doable paths, not generic advice.' },
  { title: 'Actionable roadmap', desc: 'Clear next steps, not vague suggestions.' },
  { title: 'Progress tracking', desc: 'Track your growth over time.' },
];

const WhyChooseUs = () => {
  return (
    <Section>
      <h2 className="section-heading">Why choose us</h2>
      <div className="why-grid">
        {points.map((p) => (
          <div key={p.title} className="why-item">
            <div className="why-check">✓</div>
            <div>
              <h4>{p.title}</h4>
              <p>{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};

export default WhyChooseUs;