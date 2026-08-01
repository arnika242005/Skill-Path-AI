const Opportunity = require('../models/Opportunity');
const Assessment = require('../models/Assessment');

const getRoadmap = async (req, res) => {
  try {
    const { opportunityId, assessmentId } = req.body;

    const opportunity = await Opportunity.findById(opportunityId);

    if (!opportunity) {
      return res.status(404).json({
        message: 'Opportunity not found'
      });
    }

    let answers = req.body.answers;

    if (!answers && assessmentId) {
      const assessment = await Assessment.findById(assessmentId);
      answers = assessment?.answers;
    }

    if (!answers) {
      return res.status(400).json({
        message: 'Missing answers'
      });
    }

    // roadmap directly from MongoDB
    const roadmap = opportunity.roadmap || [];

    res.json({
      opportunity: {
        id: opportunity._id,
        title: opportunity.title
      },
      roadmap
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

module.exports = {
  getRoadmap
};