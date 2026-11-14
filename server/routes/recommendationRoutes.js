const express = require('express');
const {
  getRoadmap,
  getStepHelp,
  getPitchKit,
} = require('../controllers/recommendationController');

const router = express.Router();

router.post('/roadmap', getRoadmap);
router.post('/step-help', getStepHelp);
router.post('/pitch-kit', getPitchKit);

module.exports = router;