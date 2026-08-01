import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">SkillPath<span>AI</span></Link>

        <nav className={`navbar-links ${open ? 'open' : ''}`}>
          <Link to="/">Home</Link>
          <Link to="/assessment">Get Started</Link>
          {isAuthenticated && <Link to="/profile">Dashboard</Link>}
        </nav>

        <div className="navbar-actions">
          {isAuthenticated ? (
            <div className="navbar-profile" style={{ position: 'relative' }}>
              <button
                className="profile-avatar"
                style={{ width: 40, height: 40, fontSize: 16, cursor: 'pointer' }}
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </button>
              {menuOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '48px',
                    right: 0,
                    background: 'var(--color-bg)',
                    border: '1px solid var(--color-neutral-200)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-md)',
                    minWidth: '160px',
                    overflow: 'hidden',
                    zIndex: 50,
                  }}
                >
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    style={{ display: 'block', padding: '12px 16px', fontSize: '14px' }}
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    style={{ display: 'block', width: '100%', textAlign: 'left', padding: '12px 16px', fontSize: '14px', color: 'var(--color-danger-700)' }}
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Button as={Link} to="/login" variant="ghost" size="sm">Log in</Button>
              <Button as={Link} to="/signup" variant="primary" size="sm">Sign up</Button>
            </>
          )}
        </div>

        <button className="navbar-toggle" onClick={() => setOpen(!open)}>
          {open ? '✕' : '☰'}
        </button>
      </div>
    </header>
  );
};

export default Navbar;