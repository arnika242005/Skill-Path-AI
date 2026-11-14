import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../components/ui/Container";
import Button from "../components/ui/Button";
import StatCard from "../components/profile/StatCard";
import SavedRoadmap from "../components/profile/SavedRoadMap";
import { useAuth } from "../context/AuthContext";
import { firestoreService } from "../services/firestoreService";

const Profile = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !user?.uid) {
      setLoading(false);
      return;
    }

    setLoading(true);
    firestoreService
      .getUserRoadmaps(user.uid)
      .then((data) => setRoadmaps(data || []))
      .catch((err) => console.error("Error fetching roadmaps from Firestore:", err))
      .finally(() => setLoading(false));
  }, [isAuthenticated, user?.uid]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to remove this saved roadmap?")) return;
    try {
      await firestoreService.deleteRoadmap(id);
      setRoadmaps((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Failed to delete roadmap:", err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="page-shell">
        <Container size="sm" className="empty-state-container double-bezel">
          <div className="double-bezel-inner text-center">
            <span className="eyebrow-pill">Authentication Required</span>
            <h2 className="empty-title">Log in to view your profile</h2>
            <p className="empty-subtitle">
              Sign in with your email or Google account to track your active
              roadmaps, monitor completion velocity, and save new career paths.
            </p>
            <Button
              onClick={() => navigate("/login")}
              variant="primary"
              className="mt-6"
            >
              <span>Log in to SkillPath</span>
              <span className="btn-icon-island">↗</span>
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  // Calculate statistics
  const totalRoadmaps = roadmaps.length;
  const totalSteps = roadmaps.reduce(
    (acc, r) => acc + (r.roadmap?.length || 0),
    0
  );
  const totalCompleted = roadmaps.reduce(
    (acc, r) => acc + (r.completedSteps || 0),
    0
  );
  const avgProgress = totalSteps > 0
    ? Math.round((totalCompleted / totalSteps) * 100)
    : 0;

  return (
    <div className="page-shell">
      <Container size="md" className="profile-page">
        {/* Profile Header */}
        <div className="profile-card double-bezel">
          <div className="double-bezel-inner profile-card-inner">
            <div className="profile-identity">
              <div className="profile-avatar-circle">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "Avatar"}
                    className="profile-avatar-img"
                  />
                ) : (
                  <span>
                    {(user.displayName || user.name || user.email || "U")[0].toUpperCase()}
                  </span>
                )}
              </div>

              <div className="profile-details">
                <div className="profile-badges">
                  <span className="eyebrow-pill">Active Learner</span>
                </div>
                <h2 className="profile-name">{user.displayName || user.name || "Explorer"}</h2>
                <p className="profile-email">{user.email}</p>
              </div>
            </div>

            <div className="profile-actions">
              <Button variant="ghost" onClick={handleLogout} size="sm">
                Log out
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="profile-stats-grid">
          <StatCard
            label="Saved Roadmaps"
            value={totalRoadmaps}
            subtext="Tracked opportunities"
          />
          <StatCard
            label="Milestones Done"
            value={totalCompleted}
            subtext={`Across ${totalSteps} total steps`}
          />
          <StatCard
            label="Avg. Progress"
            value={`${avgProgress}%`}
            subtext="Overall completion rate"
          />
        </div>

        {/* Saved Roadmaps Section */}
        <div className="saved-roadmaps-section">
          <div className="section-header-row">
            <div>
              <h3 className="section-title">Your Active Roadmaps</h3>
              <p className="section-subtitle">
                Resume where you left off or check off finished milestones.
              </p>
            </div>

            <Button
              variant="secondary"
              onClick={() => navigate("/assessment")}
              size="sm"
            >
              <span>+ New Assessment</span>
              <span className="btn-icon-island">↗</span>
            </Button>
          </div>

          {loading && (
            <div className="text-center py-12">
              <p className="text-muted">Loading your saved roadmaps from the cloud...</p>
            </div>
          )}

          {!loading && roadmaps.length === 0 && (
            <div className="empty-roadmaps-box double-bezel">
              <div className="double-bezel-inner text-center py-8">
                <p className="text-muted">
                  You haven't saved any roadmaps yet.
                </p>
                <Button
                  variant="primary"
                  onClick={() => navigate("/assessment")}
                  className="mt-4"
                >
                  <span>Discover Opportunities Now</span>
                  <span className="btn-icon-island">↗</span>
                </Button>
              </div>
            </div>
          )}

          <div className="roadmaps-list-stack">
            {roadmaps.map((r) => {
              const total = r.roadmap?.length || 1;
              const completed = r.completedSteps || 0;
              const percent = Math.round((completed / total) * 100);

              return (
                <SavedRoadmap
                  key={r._id}
                  roadmap={{
                    id: r._id,
                    title: r.opportunity?.title || "Custom Roadmap",
                    category: r.opportunity?.category,
                    progress: percent,
                    savedAt: r.updatedAt
                      ? new Date(r.updatedAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Recently",
                  }}
                  onDelete={handleDelete}
                />
              );
            })}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Profile;
