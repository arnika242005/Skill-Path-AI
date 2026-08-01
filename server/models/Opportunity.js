const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: String,
  description: String,
  matchTags: {
    interests: [String],
    skills: [String],
    experience: [String],
    budgetRange: [String],
    workMode: [String],
    riskLevel: [String],
    personality: [String],
  },
  startupCost: String,
  earningPotential: String,
  roadmap: [{
    title: String,
    description: String,
  }],
}, { timestamps: true });

module.exports = mongoose.model('Opportunity', opportunitySchema);