import { useEffect, useState } from 'react';
import { assessmentAPI } from '../../services/api';

const steps = [
  'Analyzing your interests...',
  'Matching opportunities...',
  'Estimating startup cost...',
  'Generating personalized roadmap...',
  'Almost done...',
];

const AnalyzingLoader = ({ answers, onDone }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const data = await assessmentAPI.submit(answers).catch(() => ({ recommendations: [] }));

      for (let i = 0; i < steps.length; i++) {
        if (cancelled) return;
        setIndex(i);
        await new Promise((r) => setTimeout(r, 700));
      }

      if (!cancelled) onDone(data.recommendations);
    };

    run();
    return () => { cancelled = true; };
  }, [answers, onDone]);

  return (
    <div className="analyzing">
      <div className="analyzing-spinner" />
      <p>{steps[index]}</p>
    </div>
  );
};

export default AnalyzingLoader;