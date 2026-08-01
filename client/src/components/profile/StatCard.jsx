import Card from '../ui/Card';

const StatCard = ({ label, value }) => {
  return (
    <Card className="stat-card">
      <span className="stat-card-value">{value}</span>
      <span className="stat-card-label">{label}</span>
    </Card>
  );
};

export default StatCard;