const express = require('express');
const protect = require('../middleware/authMiddleware');
const { getMe, getSavedRoadmaps } = require('../controllers/userController');

const router = express.Router();

router.get('/me', protect, getMe);
router.get('/roadmaps', protect, getSavedRoadmaps);

module.exports = router;