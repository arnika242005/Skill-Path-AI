import Section from '../ui/Section';
import Card from '../ui/Card';

const stories = [
  { name: 'Aditi R.', path: 'Freelance Content Writing', quote: 'Started with zero budget, now earning steady side income.' },
  { name: 'Rahul M.', path: 'Video Editing Services', quote: 'The roadmap made it easy to know what to learn first.' },
  { name: 'Priya S.', path: 'Online Tutoring', quote: 'Matched me with something I actually enjoy doing daily.' },
];

const SuccessStories = () => {
  return (
    <Section background="muted">
      <h2 className="section-heading">Success inspiration</h2>
      <div className="story-grid">
        {stories.map((s) => (
          <Card key={s.name} className="story-card">
            <p className="story-quote">"{s.quote}"</p>
            <div className="story-author">
              <span className="story-name">{s.name}</span>
              <span className="story-path">{s.path}</span>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
};

export default SuccessStories;