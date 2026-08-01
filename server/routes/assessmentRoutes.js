const express = require('express');
const { submitAssessment } = require('../controllers/assessmentController');

const router = express.Router();

// Auth optional — guests can get recommendations, only logged-in users get them saved
router.post('/', submitAssessment);

module.exports = router;