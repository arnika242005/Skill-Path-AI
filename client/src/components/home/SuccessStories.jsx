const STORIES = [
  {
    name: "Aditi Rao",
    role: "Freelance Technical Writer",
    highlight: "Earned ₹38,000 in Month 2",
    quote:
      "I was stuck wondering if I needed a coding degree. The roadmap showed me how to monetize my writing by explaining developer APIs.",
  },
  {
    name: "Rahul Mehta",
    role: "Short-Form Video Editor",
    highlight: "Scaled to 4 Monthly Retainers",
    quote:
      "The breakdown of how to build a 3-video sample portfolio before pitching creator channels was the exact blueprint I needed.",
  },
  {
    name: "Priya Sharma",
    role: "Cohort Math & SAT Tutor",
    highlight: "Replaced 60% of Daytime Salary",
    quote:
      "SkillPath matched me with online group tutoring based on my teaching interest and 2-hour evening availability. Super grounded.",
  },
];

const SuccessStories = () => {
  return (
    <section className="section-padded bg-chalk">
      <div className="section-wrap">
        <div className="section-header-center">
          <span className="eyebrow-pill">Real World Proof</span>
          <h2 className="section-heading">Built by learners, tested in practice</h2>
          <p className="section-subheading">
            Stories from individuals who turned spare hours into dependable supplemental income.
          </p>
        </div>

        <div className="stories-grid">
          {STORIES.map((s) => (
            <div key={s.name} className="story-card-bezel double-bezel">
              <div className="double-bezel-inner story-card-inner">
                <p className="story-quote">"{s.quote}"</p>

                <div className="story-footer">
                  <div className="story-author-info">
                    <strong className="story-name">{s.name}</strong>
                    <span className="story-role">{s.role}</span>
                  </div>
                  <span className="pastel-tag pastel-tag-mint">{s.highlight}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;
