import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";

const SavedRoadmap = ({ roadmap, onDelete }) => {
  const navigate = useNavigate();

  const handleResume = () => {
    navigate("/dashboard", {
      state: {
        progressId: roadmap.id,
        opportunity: {
          progressId: roadmap.id,
          title: roadmap.title,
          category: roadmap.category,
        },
      },
    });
  };

  return (
    <div className="saved-roadmap-bezel double-bezel">
      <div className="double-bezel-inner saved-roadmap-inner">
        <div className="saved-roadmap-left">
          <div className="saved-roadmap-badges">
            <span className="badge-category">{roadmap.category || "Income Path"}</span>
            <span className="saved-date-tag">Saved {roadmap.savedAt}</span>
          </div>

          <h4 className="saved-roadmap-title">{roadmap.title}</h4>

          <div className="saved-progress-row">
            <div className="saved-progress-bar-bg">
              <div
                className="saved-progress-bar-fill"
                style={{ width: `${roadmap.progress}%` }}
              />
            </div>
            <span className="saved-progress-text">{roadmap.progress}% complete</span>
          </div>
        </div>

        <div className="saved-roadmap-actions">
          <Button variant="primary" onClick={handleResume} size="sm">
            <span>Continue Plan</span>
            <span className="btn-icon-island">→</span>
          </Button>

          {onDelete && (
            <button
              type="button"
              className="btn-trash"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(roadmap.id);
              }}
              title="Delete saved roadmap"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedRoadmap;
