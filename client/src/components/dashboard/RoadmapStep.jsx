const RoadmapStep = ({ index, title, description, done, onToggle, onAskHelp }) => {
  return (
    <div
      className={`step-bezel ${done ? "is-done" : ""}`}
      onClick={onToggle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
    >
      <div className="step-inner">
        <div className="step-marker-container">
          <div className={`step-marker-circle ${done ? "marker-done" : "marker-pending"}`}>
            {done ? (
              <svg
                className="step-check-svg"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="3.5 8.5 6.5 11.5 12.5 5" />
              </svg>
            ) : (
              <span className="step-number">{index}</span>
            )}
          </div>
          <div className="step-connector-line" />
        </div>

        <div className="step-content">
          <div className="step-header">
            <div className="step-milestone-info">
              <span className="step-milestone-tag">Milestone {index}</span>
              {done && <span className="step-completed-badge">Completed ✓</span>}
            </div>

            {onAskHelp && (
              <button
                type="button"
                className="btn-copilot-trigger"
                onClick={(e) => {
                  e.stopPropagation();
                  onAskHelp({ index, title, description, done });
                }}
                title="Get unblocked on this milestone"
              >
                <span className="sparkle-dot">✦</span>
                <span>Ask Copilot</span>
              </button>
            )}
          </div>

          <h3 className={`step-title ${done ? "title-strikethrough" : ""}`}>{title}</h3>
          {description && <p className="step-description">{description}</p>}
        </div>
      </div>
    </div>
  );
};

export default RoadmapStep;
