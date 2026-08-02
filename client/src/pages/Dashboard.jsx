import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import RoadmapStep from '../components/dashboard/RoadmapStep';
import AuthPromptModal from '../components/auth/AuthPromptModal';
import { useAuth } from '../context/AuthContext';
import {
  recommendationAPI,
  progressAPI,
  pdfAPI,
} from '../services/api';

const Dashboard = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  const stored = JSON.parse(
    sessionStorage.getItem('currentRoadmap') || '{}'
  );

  const opportunity =
    location.state?.opportunity ||
    stored.opportunity ||
    {};

  const answers =
    location.state?.answers ||
    stored.answers ||
    {};

  const [roadmapSteps, setRoadmapSteps] = useState(
    location.state?.roadmap ||
    stored.roadmap || 
    []
  );

  const [progressId, setProgressId] = useState(
    location.state?.opportunity?.progressId || null
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const hasOpportunity =
    !!(opportunity.title || progressId);

  useEffect(() => {

    // Opening a saved roadmap
    if (progressId) {
      progressAPI
        .getById(progressId)
        .then((data) => {
          setRoadmapSteps(data.progress.roadmap);
          setSaved(true);
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));

      return;
    }

    // No opportunity
    if (!opportunity.title) {
      setLoading(false);
      return;
    }

    // Already generated this roadmap
    if (!progressId && (location.state?.roadmap?.length || stored.roadmap?.length)) {
      setRoadmapSteps(location.state?.roadmap || stored.roadmap);
      setLoading(false);
      return;
    }

    // Generate from AI
    recommendationAPI
      .getRoadmap({
        opportunity,
        answers,
      })
      .then((data) => {

        setRoadmapSteps(data.roadmap);

        sessionStorage.setItem(
          'currentRoadmap',
          JSON.stringify({
            opportunity,
            answers,
            roadmap: data.roadmap,
          })
        );

      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

  }, [progressId]);

  const handleSave = async () => {

    if (!isAuthenticated) {

      sessionStorage.setItem(
        'currentRoadmap',
        JSON.stringify({
          opportunity,
          answers,
          roadmap: roadmapSteps,
        })
      );

      sessionStorage.setItem(
        'pendingAction',
        JSON.stringify({
          action: 'save',
        })
      );

      setShowAuthPrompt(true);
      return;
    }

    setSaving(true);

    try {

      const data = await progressAPI.save({
        opportunity,
        roadmap: roadmapSteps,
      });

      setProgressId(data.progress._id);
      setSaved(true);

    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }

  };

  const toggleStep = async (index) => {

    if (!progressId) return;

    const updated = [...roadmapSteps];

    updated[index].done = !updated[index].done;

    setRoadmapSteps(updated);

    await progressAPI.updateStep({
      progressId,
      stepIndex: index,
      done: updated[index].done,
    });

  };

  const handleDownloadPDF = async () => {

    if (!isAuthenticated) {

      sessionStorage.setItem(
        'currentRoadmap',
        JSON.stringify({
          opportunity,
          answers,
          roadmap: roadmapSteps,
        })
      );

      sessionStorage.setItem(
        'pendingAction',
        JSON.stringify({
          action: 'download',
        })
      );

      setShowAuthPrompt(true);
      return;
    }

    try {

      const blob =
        await pdfAPI.downloadRoadmap(
          opportunity.title,
          roadmapSteps
        );

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement('a');

      link.href = url;
      link.download =
        `${opportunity.title.replace(/\s+/g, '_')}_roadmap.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error(err);
    }

  };

  if (!hasOpportunity) {
    return (
      <>
        <Navbar />

        <Container
          size="md"
          style={{
            padding: '64px 24px',
            textAlign: 'center',
          }}
        >
          <h2>No roadmap selected</h2>

          <p style={{ marginBottom: 24 }}>
            Take the assessment to generate your roadmap.
          </p>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 12,
            }}
          >
            <Button as={Link} to="/assessment">
              Take Assessment
            </Button>

            <Button
              variant="outline"
              as={Link}
              to="/profile"
            >
              View Profile
            </Button>
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

          <div
            style={{
              display: 'flex',
              gap: 12,
            }}
          >

            <Button
              variant="outline"
              onClick={handleDownloadPDF}
              disabled={!roadmapSteps.length}
            >
              Download PDF
            </Button>

            {!progressId && (
              <Button
                onClick={handleSave}
                disabled={saving || saved}
              >
                {saved
                  ? 'Saved ✓'
                  : saving
                  ? 'Saving...'
                  : 'Save Roadmap'}
              </Button>
            )}

          </div>

        </div>

        {loading && (
          <p>Generating your personalized roadmap...</p>
        )}

        {error && (
          <p style={{ color: 'red' }}>
            {error}
          </p>
        )}

        {!loading &&
          !error &&
          roadmapSteps.map((step, index) => (
            <div
              key={index}
              onClick={progressId ? () => toggleStep(index) : undefined}
              style={{
                cursor: progressId ? "pointer" : "default",
              }}       
            >
              <RoadmapStep
                index={index + 1}
                title={step.title}
                description={step.description}
                done={step.done}
              />
            </div>
          ))}

      </Container>

      <AuthPromptModal
        open={showAuthPrompt}
        onClose={() => setShowAuthPrompt(false)}
      />

      <Footer />
    </>
  );
};

export default Dashboard;