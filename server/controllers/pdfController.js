const { buildRoadmapPDF } = require('../services/pdfService');

const downloadRoadmapPDF = (req, res) => {
  const { title, roadmap } = req.body;

  if (!title || !roadmap?.length) {
    return res.status(400).json({ message: 'title and roadmap are required' });
  }

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${title.replace(/\s+/g, '_')}_roadmap.pdf"`);

  const doc = buildRoadmapPDF(title, roadmap);
  doc.pipe(res);
};

module.exports = { downloadRoadmapPDF };