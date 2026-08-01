const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answers: {
    ageGroup: String,
    currentStatus: String,
    interests: [String],
    skills: [String],
    experience: String,
    budget: String,
    workPreference: String,
    workMode: String,
    location: String,
    incomeGoal: String,
    riskLevel: String,
    personality: String,
    resources: [String],
  },
}, { timestamps: true });

module.exports = mongoose.model('Assessment', assessmentSchema);