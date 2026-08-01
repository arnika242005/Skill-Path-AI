const MatchScore = ({ score }) => {
  return (
    <div className="match-score">
      <svg viewBox="0 0 36 36" className="match-score-ring">
        <path
          className="match-score-bg"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <path
          className="match-score-fill"
          strokeDasharray={`${score}, 100`}
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
      </svg>
      <span className="match-score-value">{score}%</span>
    </div>
  );
};

export default MatchScore;