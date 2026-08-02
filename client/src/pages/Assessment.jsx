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
  { key: 'interests', title: 'What type of work interests you?', type: 'multi',
    options: ['Creative Work', 'Technology', 'Teaching & Training', 'Writing & Communication', 'Social Work', 'Marketing & Sales', 'Business & Entrepreneurship', 'Photography & Media', 'Other'] },
  { key: 'skills', title: 'What skills do you currently have?', type: 'multi',
    options: ['Coding', 'Content Writing', 'Design', 'Video Editing', 'MS Tools', 'Communication', 'Teaching', 'Cooking', 'Other'] },
  { key: 'experience', title: 'How would you rate your experience level?', type: 'single',
    options: ['Complete Beginner', 'Some Experience', 'Intermediate', 'Advanced'] },
  { key: 'availableTime', title: 'How much time can you spend daily?', type: 'single',
    options: ['Less than 1 hour', '1-3 hours', '3-5 hours', '5+ hours'] },
  { key: 'incomeGoal', title: 'What brings you here today?', type: 'single',
    options: ['Side Income', 'Full-time Career', 'Freelancing', 'Passive Income', 'Extra Pocket Money', 'Explore Opportunities'] },
  { key: 'budget', title: 'How much money can you invest initially?', type: 'single',
    options: ['₹0', '₹1 - 500', '₹500 - 2000', '₹2000 - 5000', '₹5000 - 10000', '₹10000+'] },
  { key: 'workPreference', title: 'How do you prefer working?', type: 'single',
    options: ['Independently', 'With a Team', "Both"] },
  { key: 'workMode', title: 'Online or offline work?', type: 'single',
    options: ['Online', 'Offline', 'Hybrid'] },
  { key: 'riskLevel', title: 'How much risk are you comfortable with?', type: 'single',
    options: ['Low', 'Medium', 'High'] },
  { key: 'personality', title: 'Which describes your working style?', type: 'single',
    options: ['Creative Thinker', 'Problem Solver', 'Socially Active', 'Independent', 'Leader'] },
  { key: 'resources', title: 'Which resources do you have?', type: 'multi',
    options: ['Laptop', 'Existing Social Media Audience', 'Smartphone', 'Internet Connection', 'Camera', 'Vehicle', 'Workspace'] },
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

  const isFormComplete = () => {
    return questions.every((question) => {
      const answer = answers[question.key];
  
      if (question.type === "multi") {
        if (!answer || answer.length === 0) return false;
  
        if (
          answer.includes("Other") &&
          !customInputs[question.key]?.trim()
        ) {
          return false;
        }
  
        return true;
      }
  
      return !!answer;
    });
  };
  
  const handleSubmit = () => {
    if (!isFormComplete()) return;
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
            <Button 
            onClick={handleSubmit}
            disabled={!isFormComplete()}>
              Analyze My Profile
            </Button>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Assessment;