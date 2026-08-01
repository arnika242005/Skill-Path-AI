const express = require('express');
const { getRoadmap } = require('../controllers/recommendationController');

const router = express.Router();

router.post('/roadmap', getRoadmap);

module.exports = router;