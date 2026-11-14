import { useLocation, useNavigate, Link } from "react-router-dom";
import Container from "../components/ui/Container";
import Button from "../components/ui/Button";
import ProfileSummary from "../components/recommendation/ProfileSummary";
import OpportunityCard from "../components/recommendation/OpportunityCard";

const Recommendation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve state or fallback to sessionStorage cache
  const storedAnswers = JSON.parse(sessionStorage.getItem("lastAnswers") || "{}");
  const storedRecommendations = JSON.parse(
    sessionStorage.getItem("lastRecommendations") || "[]"
  );

  const answers = location.state?.answers || storedAnswers;
  const recommendations =
    location.state?.recommendations || storedRecommendations;

  // Cache to session storage if freshly delivered
  if (location.state?.answers && location.state?.recommendations) {
    sessionStorage.setItem("lastAnswers", JSON.stringify(location.state.answers));
    sessionStorage.setItem(
      "lastRecommendations",
      JSON.stringify(location.state.recommendations)
    );
  }

  const [featured, ...rest] = recommendations;

  const handleViewRoadmap = (opportunity) => {
    navigate("/dashboard", { state: { opportunity, answers } });
  };

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="page-shell">
        <Container size="sm" className="empty-state-container double-bezel">
          <div className="double-bezel-inner text-center">
            <span className="eyebrow-pill">No Paths Found</span>
            <h2 className="empty-title">Ready to find your income path?</h2>
            <p className="empty-subtitle">
              Complete our brief 3-minute assessment to receive AI-tailored career
              and income opportunities customized to your exact skills and budget.
            </p>
            <Button
              as={Link}
              to="/assessment"
              variant="primary"
              className="mt-6"
            >
              <span>Take Assessment</span>
              <span className="btn-icon-island">↗</span>
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <Container size="lg" className="recommendation-page">
        {/* Header Section */}
        <div className="recommendation-header">
          <span className="eyebrow-pill">Matched For You</span>
          <h1 className="recommendation-title">Your Curated Income Opportunities</h1>
          <p className="recommendation-subtitle">
            Based on your answers, time budget, and available resources, here are
            the 5 highest-probability paths ranked by feasibility and return.
          </p>
        </div>

        {/* Profile Snapshot Strip */}
        <ProfileSummary answers={answers} />

        {/* Featured Best Match (Top Highlight) */}
        {featured && (
          <div className="featured-opportunity-section">
            <OpportunityCard
              opportunity={featured}
              featured={true}
              onViewRoadmap={handleViewRoadmap}
            />
          </div>
        )}

        {/* Remaining Matches */}
        <div className="secondary-opportunities-header">
          <h3 className="section-title">Alternative Viable Paths</h3>
          <p className="section-subtitle">
            Explore secondary options that also match your skill set and timeline.
          </p>
        </div>

        <div className="opportunities-grid">
          {rest.map((opp) => (
            <OpportunityCard
              key={opp.id || opp.title}
              opportunity={opp}
              featured={false}
              onViewRoadmap={handleViewRoadmap}
            />
          ))}
        </div>
      </Container>
    </div>
  );
};

export default Recommendation;
