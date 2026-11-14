const ProfileSummary = ({ answers = {} }) => {
  const skills = Array.isArray(answers.skills) ? answers.skills : [];
  const interests = Array.isArray(answers.interests) ? answers.interests : [];

  return (
    <div className="profile-summary-bezel double-bezel">
      <div className="double-bezel-inner profile-summary-content">
        <div className="summary-col">
          <span className="summary-label">Key Strengths</span>
          <div className="summary-tags">
            {skills.length > 0 ? (
              skills.map((s) => (
                <span key={s} className="pastel-tag pastel-tag-sage">
                  {s}
                </span>
              ))
            ) : (
              <span className="text-muted">General Beginner</span>
            )}
          </div>
        </div>

        <div className="summary-divider" />

        <div className="summary-col">
          <span className="summary-label">Target Domains</span>
          <div className="summary-tags">
            {interests.length > 0 ? (
              interests.slice(0, 3).map((int) => (
                <span key={int} className="pastel-tag pastel-tag-lavender">
                  {int}
                </span>
              ))
            ) : (
              <span className="text-muted">Flexible</span>
            )}
          </div>
        </div>

        <div className="summary-divider" />

        <div className="summary-col summary-meta-col">
          <div>
            <span className="summary-label">Capital Available</span>
            <span className="summary-stat-val">{answers.budget || "₹0"}</span>
          </div>
          <div>
            <span className="summary-label">Daily Bandwidth</span>
            <span className="summary-stat-val">{answers.availableTime || "1-3 hrs"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSummary;
