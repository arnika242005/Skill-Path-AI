import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Container from '../components/ui/Container';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { authAPI, progressAPI } from '../services/api';

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: '',
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
      const data = await authAPI.signup(form);

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
        navigate('/profile');
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
          <h2>Create your account</h2>

          <p className="auth-subtitle">
            Save your roadmap and track your progress.
          </p>

          <form onSubmit={handleSubmit}>
            <Input
              label="Name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />

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

            {error && (
              <p className="auth-error">{error}</p>
            )}

            <Button
              size="lg"
              className="auth-submit"
              disabled={loading}
            >
              {loading
                ? 'Creating account...'
                : 'Sign up'}
            </Button>
          </form>

          <p className="auth-switch">
            Already have an account?{' '}
            <Link to="/login">Log in</Link>
          </p>
        </Card>
      </Container>
    </>
  );
};

export default Signup;