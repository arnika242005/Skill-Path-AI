import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">

        <div className="footer-brand">
          <span className="navbar-logo">
            SkillPath<span>AI</span>
          </span>

          <p>
            Discover personalized career paths, side hustles,
            freelance opportunities, and business ideas based on
            your unique skills and interests.
          </p>
        </div>

        <div className="footer-links">

          <div>
            <h4>Explore</h4>

            <Link to="/">Home</Link>
            <Link to="/assessment">Assessment</Link>
            <Link to="/recommendations">Recommendations</Link>
            <Link to="/dashboard">Roadmap</Link>
          </div>

          <div>
            <h4>Resources</h4>

            <a href="#how-it-works">How it Works</a>
            <a href="#features">Features</a>
            <a href="#faq">FAQs</a>
          </div>

        </div>

      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} SkillPathAI. Built to help students and professionals discover smarter income opportunities.
        </p>
      </div>
    </footer>
  );
};

export default Footer;