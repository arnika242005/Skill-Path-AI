const { getRecommendations } = require('../services/aiService');

const submitAssessment = async (req, res) => {
  try {
    const { answers } = req.body;

    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ message: 'Valid answers object is required' });
    }

    const recommendations = await getRecommendations(answers);

    res.json({ recommendations });
  } catch (err) {
    console.error('Assessment error:', err.message);
    res.status(500).json({ message: err.message || 'Failed to generate recommendations' });
  }
};

module.exports = { submitAssessment };