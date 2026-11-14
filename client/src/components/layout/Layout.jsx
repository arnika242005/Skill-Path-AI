import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useAuth } from "../../context/AuthContext";

const ROUTE_TITLES = {
  "/": "SkillPath AI — Turn Your Skills into Income Paths",
  "/assessment": "Skill Assessment · SkillPath AI",
  "/recommendation": "Curated Opportunities · SkillPath AI",
  "/dashboard": "Your Action Roadmap · SkillPath AI",
  "/profile": "Dashboard & Saved Roadmaps · SkillPath AI",
  "/login": "Log In · SkillPath AI",
  "/signup": "Create Free Account · SkillPath AI",
};

const Layout = () => {
  const { pathname } = useLocation();
  const { isConfigured } = useAuth();
  const [dismissNotice, setDismissNotice] = useState(false);

  useEffect(() => {
    // Dynamic tab title update
    document.title = ROUTE_TITLES[pathname] || "SkillPath AI — Career & Income Engine";

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [pathname]);

  return (
    <div className="app-shell">
      {!isConfigured && !dismissNotice && (
        <div className="firebase-setup-banner">
          <div className="banner-inner">
            <span className="banner-badge">Setup Notice</span>
            <span className="banner-text">
              Firebase credentials pending in <code>client/.env</code>. Authentication & cloud saves will activate once configured.
            </span>
            <button
              type="button"
              className="banner-close"
              onClick={() => setDismissNotice(true)}
              aria-label="Dismiss banner"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <Navbar />

      <main className="main-viewport">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
