const Progress = require('../models/Progress');

const getMe = async (req, res) => {
  res.json({ user: req.user });
};

const getSavedRoadmaps = async (req, res) => {
  try {
    const roadmaps = await Progress.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.json({ roadmaps });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getMe, getSavedRoadmaps };