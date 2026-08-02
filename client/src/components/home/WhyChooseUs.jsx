import Section from '../ui/Section';

const points = [
  {
    title: "AI-Powered Recommendations",
    desc: "Receive personalized income opportunities based on your skills, interests, and goals."
  },
  {
    title: "Actionable Roadmaps",
    desc: "Follow a step-by-step plan that helps you start earning with confidence."
  },
  {
    title: "Progress Tracking",
    desc: "Save your roadmap, mark completed milestones, and monitor your growth."
  },
  {
    title: "Beginner Friendly",
    desc: "Whether you're a student or professional, discover opportunities that match your experience level."
  },
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