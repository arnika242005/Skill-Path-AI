const VALUE_PROPS = [
  {
    tag: "Feasibility First",
    title: "Zero-Capital Viability",
    desc: "Have ₹0 to invest? We prioritize services and digital assets with zero upfront software or hardware costs.",
  },
  {
    tag: "Granular Milestones",
    title: "Sequenced Action Steps",
    desc: "No vague advice like 'build a brand.' Every roadmap details proof-of-work generation, client outreach, and first dollar tactics.",
  },
  {
    tag: "Firebase Persistence",
    title: "Cross-Device Progress",
    desc: "Sign in with Google or Email. Track checked milestones, save multiple alternative career paths, and resume anywhere.",
  },
  {
    tag: "Private & Fast",
    title: "Sub-Second Groq AI",
    desc: "Powered by Groq's high-speed inference engine running LLaMA 3.3 70B for instant, high-precision recommendations.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="section-padded">
      <div className="section-wrap">
        <div className="section-header-center">
          <span className="eyebrow-pill">The SkillPath Standard</span>
          <h2 className="section-heading">Designed for pragmatic execution</h2>
          <p className="section-subheading">
            Built to eliminate career paralysis and replace vague tutorials with structured milestones.
          </p>
        </div>

        <div className="values-grid">
          {VALUE_PROPS.map((prop, idx) => (
            <div key={prop.title} className="value-card-bezel double-bezel">
              <div className="double-bezel-inner value-card-inner">
                <span className="pastel-tag pastel-tag-sand">{prop.tag}</span>
                <h3 className="value-title">{prop.title}</h3>
                <p className="value-desc">{prop.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
