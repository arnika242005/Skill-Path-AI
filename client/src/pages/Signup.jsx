import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Container from "../components/ui/Container";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import { firestoreService } from "../services/firestoreService";

const formatAuthError = (code) => {
  switch (code) {
    case "auth/email-already-in-use":
      return "An account with this email already exists. Try logging in instead.";
    case "auth/weak-password":
      return "Password is too weak. Please choose at least 6 characters.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/popup-closed-by-user":
      return "Google sign-up popup was closed before completing.";
    default:
      return "Registration failed. Please check your connection and details.";
  }
};

const Signup = () => {
  const navigate = useNavigate();
  const { signup, loginWithGoogle } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const processPendingAction = async (authUser) => {
    const rawRoadmap = sessionStorage.getItem("currentRoadmap");
    const rawAction = sessionStorage.getItem("pendingAction");

    if (rawRoadmap && rawAction && authUser?.uid) {
      try {
        const parsedRoadmap = JSON.parse(rawRoadmap);
        const parsedAction = JSON.parse(rawAction);

        if (parsedAction.action === "save") {
          const savedDoc = await firestoreService.saveRoadmap(
            authUser.uid,
            parsedRoadmap.opportunity,
            parsedRoadmap.roadmap
          );

          sessionStorage.removeItem("pendingAction");
          navigate("/dashboard", {
            state: {
              progressId: savedDoc._id,
              opportunity: parsedRoadmap.opportunity,
              answers: parsedRoadmap.answers,
              roadmap: parsedRoadmap.roadmap,
            },
          });
          return;
        }
      } catch (err) {
        console.warn("Pending action error in signup:", err);
      }
    }

    navigate("/profile");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      const user = await signup(form.email, form.password, form.name);
      await processPendingAction(user);
    } catch (err) {
      console.error("Signup error:", err);
      setError(formatAuthError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError("");
    setLoading(true);
    try {
      const user = await loginWithGoogle();
      await processPendingAction(user);
    } catch (err) {
      console.error("Google sign-up error:", err);
      setError(formatAuthError(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <Container size="sm" className="auth-container">
        <div className="auth-card-bezel double-bezel">
          <div className="double-bezel-inner auth-card-inner">
            <div className="auth-header text-center">
              <span className="eyebrow-pill">Start Free</span>
              <h2 className="auth-title">Create your SkillPath account</h2>
              <p className="auth-subtitle">
                Save your personalized career roadmaps and track progress from any device.
              </p>
            </div>

            {/* Google Fast Auth */}
            <button
              type="button"
              className="btn-google-auth"
              onClick={handleGoogleSignup}
              disabled={loading}
            >
              <svg className="google-icon" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Sign up with Google</span>
            </button>

            <div className="auth-divider">
              <span>or email</span>
            </div>

            <form onSubmit={handleSubmit} className="auth-form-stack">
              <Input
                label="Full name"
                type="text"
                name="name"
                placeholder="Alex Morgan"
                value={form.name}
                onChange={handleChange}
                required
              />

              <Input
                label="Email address"
                type="email"
                name="email"
                placeholder="alex@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />

              <Input
                label="Password (min 6 characters)"
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />

              {error && <div className="auth-error-banner">{error}</div>}

              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                className="w-full mt-2"
              >
                <span>{loading ? "Creating Account..." : "Create Free Account"}</span>
                <span className="btn-icon-island">→</span>
              </Button>
            </form>

            <div className="auth-footer-note text-center">
              Already have an account?{" "}
              <Link to="/login" className="auth-link">
                Log in
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Signup;
