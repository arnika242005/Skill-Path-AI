import { useEffect, useState, useRef } from "react";
import { assessmentAPI } from "../../services/api";

const STEPS = [
  { label: "Decoding your core strengths & skills", hint: "Mapping against high-demand niches" },
  { label: "Evaluating availability & investment threshold", hint: "Filtering out unrealistic capital requirements" },
  { label: "Calculating match scores & growth curves", hint: "Balancing time to first dollar with long-term upside" },
  { label: "Synthesizing your top 5 personalized paths", hint: "Curating tailored recommendations" },
];

const AnalyzingLoader = ({ answers, onComplete, onError }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [apiResult, setApiResult] = useState(null);
  const [error, setError] = useState(null);
  const hasCalled = useRef(false);

  useEffect(() => {
    if (hasCalled.current) return;
    hasCalled.current = true;

    let isMounted = true;

    // Fire single backend AI request
    assessmentAPI
      .submit(answers)
      .then((data) => {
        if (isMounted) {
          setApiResult(data.recommendations || []);
        }
      })
      .catch((err) => {
        console.error("Analysis error:", err);
        if (isMounted) {
          setError(err.message || "Failed to generate recommendations. Please try again.");
          if (onError) onError(err);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [answers, onError]);

  // Smoothly step through visual milestones
  useEffect(() => {
    if (error) return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 900);

    return () => clearInterval(interval);
  }, [error]);

  // When animation reaches end AND apiResult is ready, finish
  useEffect(() => {
    if (apiResult && currentStep >= STEPS.length - 1) {
      const timer = setTimeout(() => {
        onComplete(apiResult);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [apiResult, currentStep, onComplete]);

  return (
    <div className="analyzing-backdrop">
      <div className="analyzing-card double-bezel">
        <div className="double-bezel-inner text-center">
          {/* Compass / Path Orb Animation */}
          <div className="analyzing-orb-wrap">
            <div className="analyzing-orb" />
            <div className="analyzing-pulse" />
          </div>

          <div className="analyzing-eyebrow">
            Analyzing Profile · Step {Math.min(currentStep + 1, STEPS.length)} of {STEPS.length}
          </div>

          <h2 className="analyzing-title">{STEPS[currentStep]?.label}</h2>
          <p className="analyzing-subtitle">{STEPS[currentStep]?.hint}</p>

          {/* Stepper Dots */}
          <div className="analyzing-steps">
            {STEPS.map((step, idx) => (
              <div
                key={idx}
                className={`analyzing-step-pill ${
                  idx === currentStep
                    ? "active"
                    : idx < currentStep
                    ? "completed"
                    : "pending"
                }`}
              />
            ))}
          </div>

          {error && (
            <div className="analyzing-error">
              <p>{error}</p>
              <button
                type="button"
                className="btn btn-secondary mt-4"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyzingLoader;
