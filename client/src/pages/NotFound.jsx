import { Link } from 'react-router-dom';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';

const NotFound = () => {
  return (
    <Container size="sm" className="not-found">
      <h1>404</h1>
      <h3>Page not found</h3>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <Button as={Link} to="/">Back to Home</Button>
    </Container>
  );
};

export default NotFound;