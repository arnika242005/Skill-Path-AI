const PDFDocument = require('pdfkit');

const buildRoadmapPDF = (title, roadmap) => {
  const doc = new PDFDocument({ margin: 50 });

  doc.fontSize(20).text(title, { underline: true });
  doc.moveDown();
  doc.fontSize(12).fillColor('#6C757D').text('Your personalized income roadmap');
  doc.moveDown(2);

  roadmap.forEach((step, i) => {
    doc.fillColor('#212529').fontSize(14).text(`${i + 1}. ${step.title}`);
    doc.fontSize(11).fillColor('#495057').text(step.description, { indent: 20 });
    doc.moveDown();
  });

  doc.end();
  return doc;
};

module.exports = { buildRoadmapPDF };