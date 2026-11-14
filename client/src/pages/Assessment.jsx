import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../components/ui/Container";
import Button from "../components/ui/Button";
import OptionCard from "../components/assessment/OptionCard";
import AnalyzingLoader from "../components/assessment/AnalyzingLoader";
import { useAuth } from "../context/AuthContext";
import { firestoreService } from "../services/firestoreService";

const QUESTIONS = [
  {
    id: "ageGroup",
    category: "Profile Setup",
    title: "What is your age bracket?",
    subtitle: "Helps calibrate realistic time commitments and age-appropriate income paths.",
    type: "single",
    options: ["Under 18", "18 – 24", "25 – 34", "35 – 44", "45+"],
  },
  {
    id: "currentStatus",
    category: "Current Occupation",
    title: "What are you currently doing?",
    subtitle: "Select the option that best reflects your primary daytime focus.",
    type: "single",
    options: [
      "Student (College / School)",
      "Working Professional",
      "Freelancer / Self-Employed",
      "Homemaker / Caregiver",
      "Early Business Owner",
      "Looking for Work",
    ],
  },
  {
    id: "personality",
    category: "Working Style",
    title: "Which best describes your natural flow?",
    subtitle: "We match solo vs. collaborative paths based on your thinking style.",
    type: "single",
    options: [
      "Problem Solver (Analytical & Logic)",
      "Creative Thinker (Ideas & Design)",
      "Socially Active (People & Sales)",
      "Independent Operator (Solo Focus)",
      "System Builder (Leadership & Ops)",
    ],
  },
  {
    id: "interests",
    category: "Passions & Curiosity",
    title: "Which domains excite you most?",
    subtitle: "Select all that apply. Where your curiosity meets monetization.",
    type: "multi",
    options: [
      "Technology & AI Tools",
      "Writing & Storytelling",
      "Design & Visual Branding",
      "Marketing & Social Media",
      "Teaching, Coaching & Mentoring",
      "E-Commerce & Digital Products",
      "Video Editing & Production",
      "Health, Fitness & Lifestyle",
      "Other",
    ],
  },
  {
    id: "skills",
    category: "Current Abilities",
    title: "Which skills do you already have?",
    subtitle: "Select all you have even basic familiarity with. No need to be an expert.",
    type: "multi",
    options: [
      "Coding / Web Development",
      "Content Writing / Copywriting",
      "Graphic Design / Figma / Canva",
      "Video Editing / Reels / YouTube",
      "Communication & Sales",
      "Data, Excel & Spreadsheets",
      "Teaching / Tutoring",
      "Social Media Management",
      "Other",
    ],
  },
  {
    id: "experience",
    category: "Monetization Experience",
    title: "What is your experience making money online?",
    subtitle: "We tailor the zero-to-one learning curve so you don't get stuck.",
    type: "single",
    options: [
      "Complete Beginner (Starting from zero)",
      "Some Experience (Built small projects/hustles)",
      "Intermediate (Have earned some client income)",
      "Advanced (Seasoned freelancer or operator)",
    ],
  },
  {
    id: "availableTime",
    category: "Daily Bandwidth",
    title: "How much focused time can you spend daily?",
    subtitle: "Consistency matters more than marathon weekend sessions.",
    type: "single",
    options: [
      "Under 1 hour / day (Micro-sprints)",
      "1 – 3 hours / day (Evenings / Part-time)",
      "3 – 5 hours / day (Substantial part-time)",
      "5+ hours / day (Full-time focus)",
    ],
  },
  {
    id: "budget",
    category: "Initial Capital",
    title: "What is your upfront investment budget?",
    subtitle: "If zero, we strictly prioritize opportunities with ₹0 software or equipment cost.",
    type: "single",
    options: [
      "₹0 (Zero capital — purely skill-based)",
      "₹1 – ₹500 (Free tiers / micro tools)",
      "₹500 – ₹2,000 (Basic software)",
      "₹2,000 – ₹5,000 (Software & small tools)",
      "₹5,000 – ₹10,000+",
    ],
  },
  {
    id: "resources",
    category: "Equipment & Hardware",
    title: "What hardware and tools do you currently own?",
    subtitle: "Select all that are at your immediate disposal.",
    type: "multi",
    options: [
      "Smartphone with 4G/5G",
      "Laptop or Desktop Computer",
      "High-speed Home Internet",
      "Existing Social Following / Audience",
      "Quiet Workspace / Desk",
      "Camera or Microphone",
      "Vehicle (Two-wheeler / Car)",
    ],
  },
  {
    id: "incomeGoal",
    category: "Income Target",
    title: "What is your primary goal right now?",
    subtitle: "Helps rank immediate fast-cashflow paths vs. scalable product models.",
    type: "single",
    options: [
      "Supplemental Side Income (Extra ₹10k–₹30k)",
      "Full-Time Freelancing (Replace a day job)",
      "Digital Products / Scalable Cashflow",
      "High-Growth Agency / Business",
      "Exploration & Skill Building",
    ],
  },
  {
    id: "workMode",
    category: "Work Environment",
    title: "Do you prefer remote online work or offline?",
    subtitle: "Choose your ideal daily environment.",
    type: "single",
    options: [
      "100% Online / Remote from Home",
      "Offline / In-Person Community",
      "Hybrid (Open to both)",
    ],
  },
  {
    id: "workPreference",
    category: "Team Dynamic",
    title: "Do you prefer flying solo or collaborating?",
    subtitle: "Solo operators get different roadmaps than team builders.",
    type: "single",
    options: [
      "Solo Operator (Independent execution)",
      "Collaborative (With partner or team)",
      "Open to Both",
    ],
  },
  {
    id: "riskLevel",
    category: "Risk Tolerance",
    title: "What is your comfort level with experimentation?",
    subtitle: "How comfortable are you with trial-and-error vs. proven playbooks?",
    type: "single",
    options: [
      "Low Risk (Prefer proven, predictable models)",
      "Medium (Calculated trials and learning)",
      "High Risk (High upside, open to trial-and-error)",
    ],
  },
];

const Assessment = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [customInputs, setCustomInputs] = useState({});
  const [analyzing, setAnalyzing] = useState(false);
  const [preparedAnswers, setPreparedAnswers] = useState(null);

  const currentQ = QUESTIONS[currentIndex];
  const totalQuestions = QUESTIONS.length;
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  // Auto-scroll to top of viewport on question change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentIndex]);

  const selectOption = (option) => {
    if (currentQ.type === "single") {
      setAnswers((prev) => ({
        ...prev,
        [currentQ.id]: option,
      }));

      // Instant pleasant auto-advance on single choice! Zero scrolling needed!
      if (option !== "Other") {
        setTimeout(() => {
          if (currentIndex < totalQuestions - 1) {
            setCurrentIndex((prev) => prev + 1);
          } else {
            handleComplete({ ...answers, [currentQ.id]: option });
          }
        }, 220);
      }
    } else {
      // Multi-select toggle
      const existing = answers[currentQ.id] || [];
      const updated = existing.includes(option)
        ? existing.filter((o) => o !== option)
        : [...existing, option];

      setAnswers((prev) => ({
        ...prev,
        [currentQ.id]: updated,
      }));
    }
  };

  const isCurrentQuestionAnswered = () => {
    const val = answers[currentQ.id];
    if (currentQ.type === "multi") {
      if (!Array.isArray(val) || val.length === 0) return false;
      if (val.includes("Other") && !customInputs[currentQ.id]?.trim()) {
        return false;
      }
      return true;
    }
    return Boolean(val);
  };

  const handleNext = () => {
    if (!isCurrentQuestionAnswered()) return;
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      handleComplete(answers);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleComplete = (finalAnswersState) => {
    const finalAnswers = { ...finalAnswersState };

    // Consolidate custom "Other" inputs
    Object.keys(customInputs).forEach((key) => {
      if (
        Array.isArray(finalAnswers[key]) &&
        finalAnswers[key].includes("Other") &&
        customInputs[key]?.trim()
      ) {
        finalAnswers[key] = [
          ...finalAnswers[key].filter((item) => item !== "Other"),
          customInputs[key].trim(),
        ];
      }
    });

    setPreparedAnswers(finalAnswers);
    setAnalyzing(true);
  };

  if (analyzing && preparedAnswers) {
    return (
      <AnalyzingLoader
        answers={preparedAnswers}
        onComplete={async (recommendations) => {
          if (isAuthenticated && user?.uid) {
            try {
              await firestoreService.saveAssessment(user.uid, preparedAnswers);
            } catch (err) {
              console.warn("Failed to persist assessment to Firestore:", err);
            }
          }

          navigate("/recommendation", {
            state: {
              answers: preparedAnswers,
              recommendations,
            },
          });
        }}
        onError={() => {
          setAnalyzing(false);
        }}
      />
    );
  }

  const selectedCount = Array.isArray(answers[currentQ.id])
    ? answers[currentQ.id].length
    : 0;

  return (
    <div className="assessment-viewport-lock">
      <Container size="sm" className="assessment-wizard-container">
        {/* Top Header Bar */}
        <div className="wizard-top-bar">
          <div className="wizard-progress-info">
            <span className="eyebrow-pill">{currentQ.category}</span>
            <span className="wizard-step-counter">
              <strong>{currentIndex + 1}</strong> of {totalQuestions}
            </span>
          </div>

          <div className="wizard-fluid-track">
            <div
              className="wizard-fluid-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* The Focused Single Question Card */}
        <div className="wizard-card-bezel double-bezel">
          <div className="double-bezel-inner wizard-card-inner">
            <div className="wizard-question-header">
              <h1 className="wizard-question-title">{currentQ.title}</h1>
              <p className="wizard-question-subtitle">{currentQ.subtitle}</p>
            </div>

            {/* Option Grid */}
            <div
              className={`wizard-options-grid ${
                currentQ.options.length > 5 ? "compact-grid" : ""
              }`}
            >
              {currentQ.options.map((option) => {
                const isSelected =
                  currentQ.type === "single"
                    ? answers[currentQ.id] === option
                    : (answers[currentQ.id] || []).includes(option);

                return (
                  <React.Fragment key={option}>
                    <OptionCard
                      label={option}
                      selected={isSelected}
                      multi={currentQ.type === "multi"}
                      onClick={() => selectOption(option)}
                    />

                    {option === "Other" && isSelected && (
                      <div className="custom-input-wrapper">
                        <input
                          type="text"
                          className="custom-text-input"
                          placeholder={`Specify other ${currentQ.category.toLowerCase()}...`}
                          value={customInputs[currentQ.id] || ""}
                          onChange={(e) =>
                            setCustomInputs((prev) => ({
                              ...prev,
                              [currentQ.id]: e.target.value,
                            }))
                          }
                          autoFocus
                        />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Bottom Actions Row */}
            <div className="wizard-action-row">
              <button
                type="button"
                className="btn-wizard-back"
                onClick={handleBack}
                disabled={currentIndex === 0}
              >
                ← Back
              </button>

              {currentQ.type === "multi" ? (
                <Button
                  variant="primary"
                  onClick={handleNext}
                  disabled={!isCurrentQuestionAnswered()}
                  className="btn-wizard-continue"
                >
                  <span>
                    {currentIndex === totalQuestions - 1
                      ? "Analyze Profile"
                      : selectedCount > 0
                      ? `Continue (${selectedCount})`
                      : "Select at least 1"}
                  </span>
                  <span className="btn-icon-island">→</span>
                </Button>
              ) : (
                <div className="wizard-hint-pill">
                  <span>Click any option to auto-advance</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Assessment;
