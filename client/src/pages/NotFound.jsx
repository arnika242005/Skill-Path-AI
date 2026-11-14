import { Link } from "react-router-dom";
import Container from "../components/ui/Container";
import Button from "../components/ui/Button";

const NotFound = () => {
  return (
    <div className="page-shell">
      <Container size="sm" className="empty-state-container double-bezel">
        <div className="double-bezel-inner text-center">
          <span className="eyebrow-pill">Error 404</span>
          <h2 className="empty-title">Page Not Found</h2>
          <p className="empty-subtitle">
            The page you requested could not be located. It might have been
            moved or the URL might be mistyped.
          </p>
          <Button as={Link} to="/" variant="primary" className="mt-6">
            <span>Return to Home</span>
            <span className="btn-icon-island">→</span>
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default NotFound;
