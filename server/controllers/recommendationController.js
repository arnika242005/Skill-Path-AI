const { generateRoadmap } = require('../services/aiService');

const getRoadmap = async (req, res) => {
  try {
    const { opportunity, answers } = req.body;

    if (!opportunity || !answers) {
      return res.status(400).json({
        message: 'Opportunity and answers are required',
      });
    }

    // Generate roadmap directly from AI
    const roadmap = await generateRoadmap(answers, opportunity);

    res.json({
      opportunity,
      roadmap,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = { getRoadmap };