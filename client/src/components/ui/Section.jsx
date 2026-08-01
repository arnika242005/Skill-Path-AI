import Container from './Container';

const Section = ({ children, background = 'default', id, className = '' }) => {
  return (
    <section id={id} className={`section section-${background} ${className}`}>
      <Container>{children}</Container>
    </section>
  );
};

export default Section;