const MatchScore = ({ score = 85 }) => {
  const normalized = Math.min(100, Math.max(0, Number(score) || 80));
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalized / 100) * circumference;

  return (
    <div className="match-score-pill" title={`${normalized}% profile fit score`}>
      <svg className="match-score-svg" viewBox="0 0 44 44">
        {/* Track */}
        <circle
          className="match-score-track"
          cx="22"
          cy="22"
          r={radius}
          fill="none"
          strokeWidth="3.5"
        />
        {/* Progress fill */}
        <circle
          className="match-score-stroke"
          cx="22"
          cy="22"
          r={radius}
          fill="none"
          strokeWidth="3.5"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 22 22)"
        />
      </svg>
      <div className="match-score-text">
        <span className="match-score-number">{normalized}</span>
        <span className="match-score-percent">%</span>
      </div>
    </div>
  );
};

export default MatchScore;
