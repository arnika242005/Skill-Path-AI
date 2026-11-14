import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-wrap">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-brand-col">
            <Link to="/" className="footer-logo">
              <span className="logo-symbol">✦</span>
              <span>
                SkillPath<span className="logo-ai-accent">AI</span>
              </span>
            </Link>
            <p className="footer-tagline">
              Discover realistic, high-leverage income paths and small business
              ideas calibrated specifically to your skills, budget, and daily bandwidth.
            </p>
            <div className="footer-badges">
              <span className="pastel-tag pastel-tag-sage">Powered by Groq & LLaMA 3.3</span>
              <span className="pastel-tag pastel-tag-sand">Firebase Cloud</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="footer-links-group">
            <h4 className="footer-col-heading">Explore Platform</h4>
            <div className="footer-links-stack">
              <Link to="/">Home Overview</Link>
              <Link to="/assessment">Skill Assessment</Link>
              <Link to="/recommendation">Income Opportunities</Link>
              <Link to="/dashboard">Action Roadmap</Link>
            </div>
          </div>

          {/* Account & Resources */}
          <div className="footer-links-group">
            <h4 className="footer-col-heading">Account & Tools</h4>
            <div className="footer-links-stack">
              <Link to="/profile">Dashboard & Progress</Link>
              <Link to="/login">Log in to Account</Link>
              <Link to="/signup">Create Free Account</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <p className="footer-copyright">
            © {new Date().getFullYear()} SkillPathAI. Built for ambitious learners, students, and freelancers.
          </p>
          <div className="footer-bottom-links">
            <span className="text-muted text-xs">All rights reserved · Privacy friendly</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
