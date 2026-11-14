const OptionCard = ({ label, selected, onClick, multi = false }) => {
  return (
    <button
      type="button"
      className={`option-card-bezel ${selected ? "is-selected" : ""}`}
      onClick={onClick}
      role="checkbox"
      aria-checked={selected}
    >
      <div className="option-card-inner">
        <span className="option-card-label">{label}</span>
        <div className={`option-selector-indicator ${multi ? "is-multi" : "is-single"}`}>
          {selected && (
            <svg
              className="option-check-icon"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3.5 8.5 6.5 11.5 12.5 5" />
            </svg>
          )}
        </div>
      </div>
    </button>
  );
};

export default OptionCard;
