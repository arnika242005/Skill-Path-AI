import { useNavigate } from "react-router-dom";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { useAuth } from "../../context/AuthContext";
import { firestoreService } from "../../services/firestoreService";

const AuthPromptModal = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();

  const handleGoogleQuickSave = async () => {
    try {
      const user = await loginWithGoogle();
      const rawRoadmap = sessionStorage.getItem("currentRoadmap");
      if (rawRoadmap && user?.uid) {
        const parsed = JSON.parse(rawRoadmap);
        await firestoreService.saveRoadmap(
          user.uid,
          parsed.opportunity,
          parsed.roadmap
        );
      }
      onClose();
      navigate("/profile");
    } catch (err) {
      console.warn("Quick Google auth error:", err);
      onClose();
      navigate("/login");
    }
  };

  const goTo = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="auth-prompt-content text-center">
        <span className="eyebrow-pill">Cloud Backup</span>
        <h3 className="auth-prompt-title">Save your roadmap to cloud</h3>
        <p className="auth-prompt-desc">
          Create a free account or log in to track your milestone progress, check
          off completed steps, and access your plan from any device.
        </p>

        <button
          type="button"
          className="btn-google-auth w-full my-4"
          onClick={handleGoogleQuickSave}
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
          <span>One-Click Save with Google</span>
        </button>

        <div className="auth-prompt-actions">
          <Button variant="primary" onClick={() => goTo("/signup")} className="w-full">
            <span>Sign up with Email</span>
            <span className="btn-icon-island">↗</span>
          </Button>
          <Button variant="secondary" onClick={() => goTo("/login")} className="w-full">
            Log in to Existing Account
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AuthPromptModal;
