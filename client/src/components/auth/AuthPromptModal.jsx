import { useNavigate } from 'react-router-dom';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

const AuthPromptModal = ({ open, onClose }) => {
  const navigate = useNavigate();

  const goTo = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="auth-prompt">
        <h3>Save your roadmap</h3>
        <p>Log in or create a free account to save your roadmap and track your progress.</p>
        <div className="auth-prompt-actions">
          <Button onClick={() => goTo('/signup')}>Sign up</Button>
          <Button variant="outline" onClick={() => goTo('/login')}>Log in</Button>
        </div>
      </div>
    </Modal>
  );
};

export default AuthPromptModal;