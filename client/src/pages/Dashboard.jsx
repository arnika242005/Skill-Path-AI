import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import RoadmapStep from '../components/dashboard/RoadmapStep';
import AuthPromptModal from '../components/auth/AuthPromptModal';
import { useAuth } from '../context/AuthContext';
import { recommendationAPI, progressAPI, pdfAPI } from '../services/api';

const Dashboard = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [roadmapSteps, setRoadmapSteps] = useState([]);
  const [progressId, setProgressId] = useState(location.state?.opportunity?.progressId || null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const opportunity = location.state?.opportunity || {};
  const answers = location.state?.answers || {};
  const hasOpportunity = !!(opportunity.title || opportunity.progressId);

  useEffect(() => {
    // Case 1: coming from a saved roadmap (Profile "Continue")
    if (progressId) {
      progressAPI.getById(progressId)
        .then((data) => {
          setRoadmapSteps(data.progress.roadmap);
          setSaved(true);
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
      return;
    }

    // Case 2: no opportunity data at all (direct URL visit)
    if (!opportunity.title) {
      setLoading(false);
      return;
    }

    // Case 3: coming from Recommendation — generate roadmap via AI
    recommendationAPI.getRoadmap({ opportunity, answers })
      .then((data) => setRoadmapSteps(data.roadmap))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [opportunity.title, progressId]);

  const handleSave = async () => {
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return;
    }
    if (!opportunity.title) return;

    setSaving(true);
    try {
      const data = await progressAPI.save({ opportunity, roadmap: roadmapSteps });
      setProgressId(data.progress._id);
      setSaved(true);
    } catch (err) {
      console.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleStep = async (index) => {
    if (!progressId) return;
    const updatedDone = !roadmapSteps[index].done;
    const updated = [...roadmapSteps];
    updated[index] = { ...updated[index], done: updatedDone };
    setRoadmapSteps(updated);
    await progressAPI.updateStep({ progressId, stepIndex: index, done: updatedDone });
  };

  const handleDownloadPDF = async () => {
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return;
    }
    try {
      const blob = await pdfAPI.downloadRoadmap(opportunity.title || 'roadmap', roadmapSteps);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${(opportunity.title || 'roadmap').replace(/\s+/g, '_')}_roadmap.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err.message);
    }
  };

  if (!hasOpportunity) {
    return (
      <>
        <Navbar />
        <Container size="md" style={{ padding: '64px 24px', textAlign: 'center' }}>
          <h2>No roadmap selected</h2>
          <p style={{ marginBottom: '24px' }}>
            Take the assessment to get a personalized roadmap, or check your saved roadmaps in your profile.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Button as={Link} to="/assessment">Take Assessment</Button>
            <Button variant="outline" as={Link} to="/profile">View Profile</Button>
          </div>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container size="md" className="dashboard">
        <div className="dashboard-header">
          <div>
            <h2>{opportunity.title}</h2>
            <p>Your personalized roadmap to get started.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button variant="outline" onClick={handleDownloadPDF} disabled={!roadmapSteps.length}>
              Download PDF
            </Button>
            {!progressId && (
              <Button onClick={handleSave} disabled={saving || saved}>
                {saved ? 'Saved ✓' : saving ? 'Saving...' : 'Save Roadmap'}
              </Button>
            )}
          </div>
        </div>

        {loading && <p>Generating your personalized roadmap...</p>}
        {error && <p style={{ color: 'var(--color-danger-700)' }}>{error}</p>}

        {!loading && !error && (
          <div className="dashboard-roadmap">
            {roadmapSteps.map((step, i) => (
              <div key={step.title} onClick={() => toggleStep(i)}>
                <RoadmapStep index={i + 1} title={step.title} description={step.description} done={step.done} />
              </div>
            ))}
          </div>
        )}
      </Container>

      <AuthPromptModal open={showAuthPrompt} onClose={() => setShowAuthPrompt(false)} />
      <Footer />
    </>
  );
};

export default Dashboard;