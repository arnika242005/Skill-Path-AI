const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    opportunity: {
      title: { type: String, required: true },
      category: String,
      description: String,
      why: String,
      matchScore: Number,
      startupCost: String,
      earningPotential: String,
    },

    roadmap: [
      {
        title: String,
        description: String,
        done: {
          type: Boolean,
          default: false,
        },
      },
    ],

    completedSteps: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Progress", progressSchema);