const ProgressBar = ({ current, total }) => {
  const percent = Math.min(100, Math.max(0, Math.round((current / total) * 100)));

  return (
    <div className="assessment-progress-wrapper">
      <div className="progress-meta">
        <span className="progress-step-indicator">
          Step {current} <span className="text-muted">of {total}</span>
        </span>
        <span className="progress-percentage">{percent}% completed</span>
      </div>

      <div className="progress-track" role="progressbar" aria-valuenow={percent} aria-valuemin="0" aria-valuemax="100">
        <div
          className="progress-fluid-fill"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
