const express = require('express');
const protect = require('../middleware/authMiddleware');
const { saveRoadmap, updateStep, getProgressById } = require('../controllers/progressController');

const router = express.Router();

router.post('/', protect, saveRoadmap);
router.patch('/step', protect, updateStep);
router.get('/:id', protect, getProgressById);

module.exports = router;