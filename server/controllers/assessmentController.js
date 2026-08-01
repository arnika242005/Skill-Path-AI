const Assessment = require('../models/Assessment');
const { getRecommendations } = require('../services/aiService');

const submitAssessment = async (req, res) => {
  try {
    const { answers } = req.body;

    // Save assessment only if logged in; guests still get recommendations
    let assessment = null;
    if (req.user) {
      assessment = await Assessment.create({ user: req.user._id, answers });
    }

    const recommendations = await getRecommendations(answers);

    res.json({ assessmentId: assessment?._id || null, recommendations });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { submitAssessment };