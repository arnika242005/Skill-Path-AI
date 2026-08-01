import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="navbar-logo">SkillPath<span>AI</span></span>
          <p>Turn your skills into a real income path.</p>
        </div>

        <div className="footer-links">
          <div>
            <h4>Product</h4>
            <Link to="/assessment">Get Started</Link>
            <Link to="/dashboard">Dashboard</Link>
          </div>
          <div>
            <h4>Company</h4>
            <a href="#">About</a>
            <a href="#">Contact</a>
          </div>
          <div>
            <h4>Legal</h4>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} SkillPathAI. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;