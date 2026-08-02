import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import OptionCard from '../components/assessment/OptionCard';
import AnalyzingLoader from '../components/assessment/AnalyzingLoader';
import { assessmentAPI } from "../services/api";

const questions = [
  { key: 'ageGroup', title: 'What is your age group?', type: 'single',
    options: ['Under 18', '18-24', '25-34', '35-44', '45+'] },
  { key: 'currentStatus', title: 'What are you currently?', type: 'single',
    options: ['Student', 'Working Professional', 'Freelancer', 'Homemaker', 'Business Owner', 'Looking for Work'] },
  { key: 'interests', title: 'What are your interests?', type: 'multi',
    options: ['Design', 'Writing', 'Photography', 'Videography', 'Teaching', 'Marketing', 'Social Media', 'Other'] },
  { key: 'skills', title: 'What skills do you already have?', type: 'multi',
    options: ['Video Editing', 'Content Writing', 'Excel', 'Teaching', 'MS Office', 'Design', 'Coding', 'Other'] },
  { key: 'experience', title: 'Rate your overall experience', type: 'single',
    options: ['Beginner', 'Intermediate', 'Advanced'] },
  { key: 'budget', title: 'How much money can you invest initially?', type: 'single',
    options: ['₹0', '₹1 - 500', '₹500 - 2000', '₹2000 - 5000', '₹5000 - 10000', '₹10000+'] },
  { key: 'workPreference', title: 'How do you prefer working?', type: 'single',
    options: ['Alone', 'Team', "Doesn't matter"] },
  { key: 'workMode', title: 'Online or offline work?', type: 'single',
    options: ['Online', 'Offline', 'Both'] },
  { key: 'incomeGoal', title: 'What brings you here today?', type: 'single',
    options: ['Side Income', 'Full-time Business', 'Freelancing', 'Passive Income', 'Extra Pocket Money', 'Career Change', 'Just Exploring'] },
  { key: 'riskLevel', title: 'How much risk are you comfortable with?', type: 'single',
    options: ['Low', 'Medium', 'High'] },
  { key: 'personality', title: 'Which describes you best?', type: 'single',
    options: ['Creative', 'Analytical', 'Social', 'Independent', 'Leader'] },
  { key: 'resources', title: 'Which of these do you have?', type: 'multi',
    options: ['Laptop', 'Desktop', 'Smartphone', 'Internet Connection', 'Camera', 'Vehicle', 'Workspace'] },
];

const Assessment = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [analyzing, setAnalyzing] = useState(false);
  const [customInputs, setCustomInputs] = useState({});

  const selectOption = (question, option) => {
    setAnswers((prev) => {
      if (question.type === "single") {
        return {
          ...prev,
          [question.key]: option,
        };
      }
  
      const existing = prev[question.key] || [];
  
      return {
        ...prev,
        [question.key]: existing.includes(option)
          ? existing.filter((o) => o !== option)
          : [...existing, option],
      };
    });
  };

  const handleSubmit = () => {
    setAnalyzing(true);
  };

  if (analyzing) {
    return (
      <AnalyzingLoader
      onDone={async () => {
        try {
          const finalAnswers = { ...answers };
      
          ["skills", "interests", "resources"].forEach((key) => {
            if (
              finalAnswers[key]?.includes("Other") &&
              customInputs[key]?.trim()
            ) {
              finalAnswers[key] = [
                ...finalAnswers[key].filter((item) => item !== "Other"),
                customInputs[key].trim(),
              ];
            }
          });
      
          const data = await assessmentAPI.submit(finalAnswers);
      
          navigate("/recommendation", {
            state: {
              answers: finalAnswers,
              recommendations: data.recommendations,
            },
          });
        } catch (err) {
          console.error(err);
          alert("Failed to generate recommendations.");
          setAnalyzing(false);
        }
      }}
      />
    );
  }

  return (
    <>  
      <Container size="sm" className="assessment">
        <div className="assessment-intro">
          <h2>Let's find your best income path</h2>
          <p>
            Answer a few questions so we can recommend opportunities that
            match your interests, skills, and goals.
          </p>
        </div>
  
        <div className="assessment-form">
          {questions.map((question) => (
            <div key={question.key} className="assessment-section">
              <h3>{question.title}</h3>
  
              <div className="option-grid">
                {question.options.map((option) => {
                  const selected =
                    question.type === "single"
                      ? answers[question.key] === option
                      : (answers[question.key] || []).includes(option);
  
                  return (
                    <>
                    <OptionCard
                      key={option}
                      label={option}
                      selected={selected}
                      onClick={() => selectOption(question, option)}
                    />
                    {option === "Other" && selected && (
                      <input
                          type="text"
                          placeholder={`Enter other ${question.key}`}
                          value={customInputs[question.key] || ""}
                          onChange={(e) =>
                              setCustomInputs((prev) => ({
                                  ...prev,
                                  [question.key]: e.target.value,
                              }))
                          }
                          className="other-input"
                      />
                  )}
                  </>
                  );
                })}
              </div>
            </div>
          ))}
  
          <div className="assessment-submit">
            <Button onClick={handleSubmit}>
              Analyze My Profile
            </Button>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Assessment;