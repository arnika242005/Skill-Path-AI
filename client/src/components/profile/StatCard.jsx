const StatCard = ({ label, value, subtext }) => {
  return (
    <div className="stat-card-bezel double-bezel">
      <div className="double-bezel-inner stat-card-inner">
        <span className="stat-card-value">{value}</span>
        <span className="stat-card-label">{label}</span>
        {subtext && <span className="stat-card-subtext">{subtext}</span>}
      </div>
    </div>
  );
};

export default StatCard;
