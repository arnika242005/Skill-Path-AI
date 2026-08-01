const ProgressBar = ({ current, total }) => {
  const percent = Math.round((current / total) * 100);

  return (
    <div className="progress-wrap">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
      <span className="progress-label">Question {current} of {total}</span>
    </div>
  );
};

export default ProgressBar;