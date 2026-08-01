import Card from '../ui/Card';

const ProfileSummary = ({ answers }) => {
  const items = [
    { label: 'Interests', value: (answers.interests || []).join(', ') || '—' },
    { label: 'Skills', value: (answers.skills || []).join(', ') || '—' },
    { label: 'Budget', value: answers.budget || '—' },
    { label: 'Risk Level', value: answers.riskLevel || '—' },
  ];

  return (
    <Card className="profile-summary">
      <h4>Your Profile</h4>
      <div className="profile-grid">
        {items.map((item) => (
          <div key={item.label} className="profile-item">
            <span className="profile-label">{item.label}</span>
            <span className="profile-value">{item.value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ProfileSummary;