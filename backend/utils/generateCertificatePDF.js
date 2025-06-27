const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function generateCertificatePDF(certificate, outputPath) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4', layout: 'landscape' });
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    // Border
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke('#1e293b');

    // Watermark
    doc.save();
    doc.rotate(-30, { origin: [doc.page.width / 2, doc.page.height / 2] });
    doc.font('Helvetica-Bold')
      .fontSize(100)
      .fillColor('#4f46e5')
      .opacity(0.08)
      .text('Student Era', doc.page.width / 2 - 300, doc.page.height / 2 - 50, {
        align: 'center',
        width: 600
      });
    doc.opacity(1).restore();

    // Logo (top-left, larger)
    const logoPath = path.join(__dirname, '../templates/company-logo.png');
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 60, 40, { width: 120 });
    }

    // Title
    doc.moveTo(0, 0); // reset position
    doc.fontSize(32).font('Helvetica-Bold').fillColor('#1e293b').text('Certificate of Completion', 0, 80, { align: 'center' });
    doc.moveDown(1);
    doc.fontSize(16).font('Helvetica').fillColor('black').text('This is to certify that', { align: 'center' });

    // Candidate Name
    doc.moveDown(0.5);
    doc.fontSize(28).font('Helvetica-Bold').fillColor('#0e7490').text(certificate.candidateName, { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(16).font('Helvetica').fillColor('black').text('has successfully completed the internship in', { align: 'center' });
    doc.moveDown(0.2);
    doc.fontSize(22).font('Helvetica-Bold').fillColor('#1e293b').text(certificate.internshipTitle, { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(16).font('Helvetica').fillColor('black').text(`Duration: ${certificate.duration}`, { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(16).font('Helvetica').fillColor('black').text(`Completion Date: ${new Date(certificate.completionDate).toLocaleDateString()}`, { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(14).font('Helvetica').fillColor('black').text(`Certificate ID: ${certificate.certificateId}`, { align: 'center' });

    // Signature area
    const y = doc.page.height - 120;
    doc.fontSize(14).font('Helvetica').fillColor('black').text('_________________________', 100, y, { align: 'left' });
    doc.text(certificate.signatureName || 'Authorized Signature', 100, y + 20, { align: 'left' });
    // For Student Era + Stamp
    doc.fontSize(12).text('For Student Era', doc.page.width - 250, y + 20, { align: 'left' });
    const stampPath = path.join(__dirname, '../templates/stamp.png');
    if (fs.existsSync(stampPath)) {
      doc.opacity(0.5).image(stampPath, doc.page.width - 170, y - 10, { width: 70 }).opacity(1);
    }

    doc.end();
    stream.on('finish', () => resolve());
    stream.on('error', reject);
  });
}

module.exports = generateCertificatePDF; 