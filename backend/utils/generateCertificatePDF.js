const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function generateCertificatePDF(certificate, outputPath) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4', layout: 'landscape' });
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    // Background and border
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke('#1e293b');

    // Logo
    const logoPath = path.join(__dirname, '../templates/company-logo.png');
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, doc.page.width / 2 - 40, 40, { width: 80 });
    }

    // Title
    doc.moveDown(2);
    doc.fontSize(32).font('Helvetica-Bold').fillColor('#1e293b').text('Certificate of Completion', { align: 'center' });
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
    doc.moveDown(3);
    doc.fontSize(14).font('Helvetica').fillColor('black').text('_________________________', 100, doc.page.height - 120, { align: 'left' });
    doc.text('Authorized Signature', 100, doc.page.height - 100, { align: 'left' });
    doc.fontSize(12).text('For Student Era', doc.page.width - 200, doc.page.height - 100, { align: 'left' });

    doc.end();
    stream.on('finish', () => resolve());
    stream.on('error', reject);
  });
}

module.exports = generateCertificatePDF; 