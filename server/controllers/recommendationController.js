const {
  generateRoadmap,
  getStepHelp,
  getPitchKit,
} = require('../services/aiService');

const getRoadmap = async (req, res) => {
  try {
    const { opportunity, answers } = req.body;

    if (!opportunity || !answers) {
      return res.status(400).json({
        message: 'Opportunity and answers are required',
      });
    }

    const roadmap = await generateRoadmap(answers, opportunity);

    res.json({
      opportunity,
      roadmap,
    });
  } catch (err) {
    console.error('Roadmap error:', err.message);
    res.status(500).json({
      message: err.message,
    });
  }
};

const getStepHelpController = async (req, res) => {
  try {
    const { stepTitle, stepDescription, opportunityTitle, userQuestion } = req.body;

    if (!stepTitle) {
      return res.status(400).json({ message: 'stepTitle is required' });
    }

    const help = await getStepHelp({
      stepTitle,
      stepDescription,
      opportunityTitle,
      userQuestion,
    });

    res.json({ help });
  } catch (err) {
    console.error('Step help error:', err.message);
    res.status(500).json({ message: err.message || 'Failed to generate step guidance' });
  }
};

const getPitchKitController = async (req, res) => {
  try {
    const { opportunityTitle, category, skills } = req.body;

    if (!opportunityTitle) {
      return res.status(400).json({ message: 'opportunityTitle is required' });
    }

    const pitchKit = await getPitchKit({
      opportunityTitle,
      category,
      skills,
    });

    res.json({ pitchKit });
  } catch (err) {
    console.error('Pitch kit error:', err.message);
    res.status(500).json({ message: err.message || 'Failed to generate outreach pitch kit' });
  }
};

module.exports = {
  getRoadmap,
  getStepHelp: getStepHelpController,
  getPitchKit: getPitchKitController,
};