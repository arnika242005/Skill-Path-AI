import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Container from '../components/ui/Container';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { authAPI, progressAPI } from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authAPI.login(form);

      login(data.user);

      const roadmap = JSON.parse(
        sessionStorage.getItem('currentRoadmap') || 'null'
      );

      const action = JSON.parse(
        sessionStorage.getItem('pendingAction') || 'null'
      );

      if (roadmap && action) {
        if (action.action === 'save') {
          const savedData = await progressAPI.save({
            opportunity: roadmap.opportunity,
            roadmap: roadmap.roadmap,
          });

          sessionStorage.removeItem('currentRoadmap');
          sessionStorage.removeItem('pendingAction');

          navigate('/dashboard', {
            state: {
              opportunity: {
                ...roadmap.opportunity,
                progressId: savedData.progress._id,
              },
              answers: roadmap.answers,
              roadmap: roadmap.roadmap,
            },
          });
        } else if (action.action === 'download') {
          sessionStorage.removeItem('currentRoadmap');
          sessionStorage.removeItem('pendingAction');

          navigate('/dashboard', {
            state: {
              opportunity: roadmap.opportunity,
              answers: roadmap.answers,
              roadmap: roadmap.roadmap,
            },
          });
        }
      } else {
        navigate(location.state?.from || '/profile');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <Container size="sm" className="auth-page">
        <Card className="auth-card">
          <h2>Welcome back</h2>

          <p className="auth-subtitle">
            Log in to access your saved roadmaps.
          </p>

          <form onSubmit={handleSubmit}>
            <Input
              label="Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />

            {error && <p className="auth-error">{error}</p>}

            <Button
              size="lg"
              className="auth-submit"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log in'}
            </Button>
          </form>

          <p className="auth-switch">
            Don't have an account?{' '}
            <Link to="/signup">Sign up</Link>
          </p>
        </Card>
      </Container>
    </>
  );
};

export default Login;