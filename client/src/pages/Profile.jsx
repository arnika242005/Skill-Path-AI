import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import StatCard from '../components/profile/StatCard';
import SavedRoadmap from '../components/profile/SavedRoadMap';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';

const Profile = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
  
    userAPI
      .getSavedRoadmaps()
      .then((data) => setRoadmaps(data.roadmaps))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!isAuthenticated) {
    return (
      <Container
        size="md"
        style={{
          minHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <h2>Login Required</h2>
  
        <p style={{ margin: "16px 0 28px" }}>
          Please log in to view your profile, saved roadmaps, and progress.
        </p>
  
        <Button onClick={() => navigate("/login")}>
          Login
        </Button>
      </Container>
    );
  }
  
  const avgProgress = roadmaps.length
    ? Math.round(
        roadmaps.reduce((sum, r) => sum + (r.completedSteps / (r.roadmap.length || 1)) * 100, 0) / roadmaps.length
      )
    : 0;

  return (
    <>
      <Container size="md" className="profile">
        <div className="profile-header">
          <div className="profile-avatar">{user?.name?.[0]?.toUpperCase() || 'U'}</div>
          <div>
            <h2>{user?.name || 'Your Profile'}</h2>
            <p>{user?.email || 'user@example.com'}</p>
          </div>
          <Button variant="ghost" onClick={handleLogout}>Log out</Button>
        </div>

        <div className="profile-stats">
          <StatCard label="Saved Roadmaps" value={roadmaps.length} />
          <StatCard label="Avg. Progress" value={`${avgProgress}%`} />
          <StatCard label="Assessments Taken" value={roadmaps.length ? '1+' : '0'} />
        </div>

        <div className="profile-section-header">
  <h3 className="profile-section-title">Saved Roadmaps</h3>

  <Button
    variant="outline"
    onClick={() => navigate('/assessment')}
  >
    Retake Assessment
  </Button>
</div>

{loading && <p>Loading your roadmaps...</p>}
{!loading && roadmaps.length === 0 && <p>No saved roadmaps yet.</p>}

{roadmaps.map((r) => (
  <SavedRoadmap
    key={r._id}
    roadmap={{
      id: r._id,
      title: r.opportunity?.title,
      progress: Math.round(
        (r.completedSteps / (r.roadmap.length || 1)) * 100
      ),
      savedAt: new Date(r.updatedAt).toLocaleDateString(),
    }}
  />
))}
      </Container>
    </>
  );
};

export default Profile;