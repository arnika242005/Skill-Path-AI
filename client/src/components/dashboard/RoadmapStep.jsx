import Card from '../ui/Card';

const RoadmapStep = ({ index, title, description, done }) => {
  return (
    <Card className={`roadmap-step ${done ? 'done' : ''}`}>
      <div className="roadmap-step-marker">{done ? '✓' : index}</div>
      <div>
        <h4>{title}</h4>
        <p>{description}</p>
      </div>
    </Card>
  );
};

export default RoadmapStep;