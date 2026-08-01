const Progress = require("../models/Progress");

const saveRoadmap = async (req, res) => {
  try {
    const { opportunity, roadmap } = req.body;

    if (!opportunity || !roadmap) {
      return res.status(400).json({
        message: "Opportunity and roadmap are required",
      });
    }

    // Check if this roadmap is already saved
    const existing = await Progress.findOne({
      user: req.user._id,
      "opportunity.title": opportunity.title,
    });

    if (existing) {
      existing.opportunity = opportunity;
      existing.roadmap = roadmap.map((step) => ({
        ...step,
        done: false,
      }));
      existing.completedSteps = 0;

      await existing.save();

      return res.json({ progress: existing });
    }

    const progress = await Progress.create({
      user: req.user._id,

      opportunity: {
        title: opportunity.title,
        description: opportunity.description,
        why: opportunity.why,
        matchScore: opportunity.matchScore,
      },

      roadmap: roadmap.map((step) => ({
        ...step,
        done: false,
      })),

      completedSteps: 0,
    });

    res.status(201).json({ progress });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const updateStep = async (req, res) => {
  try {
    const { progressId, stepIndex, done } = req.body;

    const progress = await Progress.findOne({
      _id: progressId,
      user: req.user._id,
    });

    if (!progress)
      return res.status(404).json({
        message: "Progress not found",
      });

    if (!progress.roadmap[stepIndex]) {
      return res.status(400).json({
        message: "Invalid step index",
      });
    }

    progress.roadmap[stepIndex].done = done;
    progress.completedSteps = progress.roadmap.filter(
      (step) => step.done
    ).length;

    await progress.save();

    res.json({ progress });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const getProgressById = async (req, res) => {
  try {
    const progress = await Progress.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!progress)
      return res.status(404).json({
        message: "Progress not found",
      });

    res.json({ progress });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  saveRoadmap,
  updateStep,
  getProgressById,
};