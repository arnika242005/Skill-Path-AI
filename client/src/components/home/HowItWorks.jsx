const STEPS = [
  {
    step: "01",
    eyebrow: "Input Constraints",
    title: "Detail your exact realities",
    desc: "Share your current proficiency, daily hours (even if just 45 mins), budget limit, and hardware. No generic assumptions.",
    tag: "3 Minutes",
  },
  {
    step: "02",
    eyebrow: "AI Matching",
    title: "Synthesize viability curves",
    desc: "Our Groq LLaMA 3.3 model cross-references 13 dimensions to rank realistic business or freelance models that fit your life.",
    tag: "Instant Analysis",
  },
  {
    step: "03",
    eyebrow: "Execution Plan",
    title: "Follow sequenced milestones",
    desc: "Get an action roadmap from first dollar to repeatable growth. Check off milestones, track progress, and export as PDF.",
    tag: "Cloud Synced",
  },
];

const HowItWorks = () => {
  return (
    <section className="section-padded bg-chalk">
      <div className="section-wrap">
        <div className="section-header-center">
          <span className="eyebrow-pill">Sequenced Architecture</span>
          <h2 className="section-heading">How SkillPath works for you</h2>
          <p className="section-subheading">
            A frictionless bridge between what you know today and what you can earn tomorrow.
          </p>
        </div>

        <div className="how-bento-grid">
          {STEPS.map((s, idx) => (
            <div key={s.step} className="how-card-bezel double-bezel">
              <div className="double-bezel-inner how-card-inner">
                <div className="how-card-top">
                  <span className="how-step-badge">{s.step}</span>
                  <span className="pastel-tag pastel-tag-sage">{s.tag}</span>
                </div>

                <div className="how-card-body">
                  <span className="how-eyebrow">{s.eyebrow}</span>
                  <h3 className="how-title">{s.title}</h3>
                  <p className="how-desc">{s.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
