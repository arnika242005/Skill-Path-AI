import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Button from "../ui/Button";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false);
    setProfileDropdown(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    setProfileDropdown(false);
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <>
      <header className="navbar-floating-wrapper">
        <div className="navbar-floating-island">
          {/* Brand Logo */}
          <Link to="/" className="navbar-logo-link">
            <span className="logo-symbol">✦</span>
            <span className="logo-wordmark">
              SkillPath<span className="logo-ai-accent">AI</span>
            </span>
          </Link>

          {/* Center Links (Desktop) */}
          <nav className="navbar-nav-desktop" aria-label="Main Navigation">
            <Link
              to="/"
              className={`nav-item-link ${location.pathname === "/" ? "is-active" : ""}`}
            >
              Home
            </Link>
            <Link
              to="/assessment"
              className={`nav-item-link ${location.pathname === "/assessment" ? "is-active" : ""}`}
            >
              Discover
            </Link>
            <Link
              to="/recommendation"
              className={`nav-item-link ${location.pathname === "/recommendation" ? "is-active" : ""}`}
            >
              Opportunities
            </Link>
            <Link
              to="/dashboard"
              className={`nav-item-link ${location.pathname === "/dashboard" ? "is-active" : ""}`}
            >
              Roadmap
            </Link>
            {isAuthenticated && (
              <Link
                to="/profile"
                className={`nav-item-link ${location.pathname === "/profile" ? "is-active" : ""}`}
              >
                Dashboard
              </Link>
            )}
          </nav>

          {/* Right Action / Profile */}
          <div className="navbar-actions-desktop">
            {isAuthenticated ? (
              <div className="navbar-profile-rel">
                <button
                  type="button"
                  className="profile-avatar-pill"
                  onClick={() => setProfileDropdown(!profileDropdown)}
                  aria-expanded={profileDropdown}
                  aria-label="User profile menu"
                >
                  <span className="profile-pill-letter">
                    {(user.displayName || user.name || user.email || "U")[0].toUpperCase()}
                  </span>
                  <span className="profile-pill-name">
                    {user.displayName || user.name || "Account"}
                  </span>
                  <span className="profile-pill-arrow">▾</span>
                </button>

                {profileDropdown && (
                  <div className="profile-glass-menu double-bezel">
                    <div className="double-bezel-inner menu-inner">
                      <div className="menu-user-summary">
                        <strong>{user.displayName || user.name || "User"}</strong>
                        <span className="text-muted text-xs truncate">{user.email}</span>
                      </div>
                      <div className="menu-divider" />
                      <Link
                        to="/profile"
                        className="menu-link"
                        onClick={() => setProfileDropdown(false)}
                      >
                        My Saved Roadmaps
                      </Link>
                      <Link
                        to="/assessment"
                        className="menu-link"
                        onClick={() => setProfileDropdown(false)}
                      >
                        New Assessment
                      </Link>
                      <div className="menu-divider" />
                      <button
                        type="button"
                        className="menu-link text-danger"
                        onClick={handleLogout}
                      >
                        Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons-cluster">
                <Button as={Link} to="/login" variant="ghost" size="sm">
                  Log in
                </Button>
                <Button as={Link} to="/signup" variant="primary" size="sm">
                  <span>Sign up</span>
                  <span className="btn-icon-island">↗</span>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            className={`navbar-hamburger-btn ${menuOpen ? "is-open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            <span className="ham-line ham-top" />
            <span className="ham-line ham-mid" />
            <span className="ham-line ham-bot" />
          </button>
        </div>
      </header>

      {/* Fullscreen Mobile Glass Sheet */}
      {menuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setMenuOpen(false)}>
          <div className="mobile-menu-panel" onClick={(e) => e.stopPropagation()}>
            <nav className="mobile-nav-links">
              <Link to="/" onClick={() => setMenuOpen(false)}>
                Home
              </Link>
              <Link to="/assessment" onClick={() => setMenuOpen(false)}>
                Take Assessment
              </Link>
              <Link to="/recommendation" onClick={() => setMenuOpen(false)}>
                Curated Opportunities
              </Link>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
                Current Roadmap
              </Link>
              {isAuthenticated ? (
                <>
                  <Link to="/profile" onClick={() => setMenuOpen(false)}>
                    My Profile & Saved Plans
                  </Link>
                  <button
                    type="button"
                    className="mobile-logout-btn"
                    onClick={handleLogout}
                  >
                    Log out ({user.email})
                  </button>
                </>
              ) : (
                <div className="mobile-auth-stack">
                  <Button
                    as={Link}
                    to="/signup"
                    variant="primary"
                    onClick={() => setMenuOpen(false)}
                  >
                    <span>Sign up free</span>
                    <span className="btn-icon-island">↗</span>
                  </Button>
                  <Button
                    as={Link}
                    to="/login"
                    variant="secondary"
                    onClick={() => setMenuOpen(false)}
                  >
                    Log in
                  </Button>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
