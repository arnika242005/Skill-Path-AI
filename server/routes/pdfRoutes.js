const express = require('express');
const { downloadRoadmapPDF } = require('../controllers/pdfController');

const router = express.Router();

router.post('/roadmap', downloadRoadmapPDF);

module.exports = router;