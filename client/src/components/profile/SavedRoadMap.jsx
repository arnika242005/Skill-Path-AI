import { useNavigate } from 'react-router-dom';
import Card from '../ui/Card';
import Button from '../ui/Button';

const SavedRoadmap = ({ roadmap }) => {
  const navigate = useNavigate();

  return (
    <Card hover className="saved-roadmap-item">
      <div>
        <h4>{roadmap.title}</h4>
        <p>{roadmap.progress}% complete · Saved {roadmap.savedAt}</p>
      </div>
      <Button
        variant="outline"
        onClick={() => navigate('/dashboard', { state: { opportunity: { progressId: roadmap.id, title: roadmap.title } } })}
      >
        Continue →
      </Button>
    </Card>
  );
};

export default SavedRoadmap;