const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function generateCertificatePDF(certificate, outputPath) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4', layout: 'landscape' });
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    // Border with subtle shadow
    doc.save();
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).lineWidth(3).stroke('#4f46e5');
    doc.restore();

    // Watermark
    doc.save();
    doc.rotate(-30, { origin: [doc.page.width / 2, doc.page.height / 2] });
    doc.font('Helvetica-Bold')
      .fontSize(100)
      .fillColor('#4f46e5')
      .opacity(0.07)
      .text('Student Era', doc.page.width / 2 - 300, doc.page.height / 2 - 50, {
        align: 'center',
        width: 600
      });
    doc.opacity(1).restore();

    // Centered logo (larger)
    const logoPath = path.join(__dirname, '../templates/company-logo.png');
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, doc.page.width / 2 - 80, 50, { width: 160 });
    }

    // Title
    doc.moveDown(2);
    doc.fontSize(38).font('Helvetica-Bold').fillColor('#1e293b').text('Certificate of Completion', 0, 150, { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(18).font('Helvetica').fillColor('#333').text('This is to certify that', { align: 'center' });

    // Candidate Name
    doc.moveDown(0.5);
    doc.fontSize(30).font('Helvetica-Bold').fillColor('#0e7490').text(certificate.candidateName, { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(18).font('Helvetica').fillColor('#222').text('has successfully completed the internship in', { align: 'center' });
    doc.moveDown(0.2);
    doc.fontSize(24).font('Helvetica-Bold').fillColor('#1e293b').text(certificate.internshipTitle, { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(16).font('Helvetica').fillColor('#444').text(`Duration: ${certificate.duration}`, { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(16).font('Helvetica').fillColor('#444').text(`Completion Date: ${new Date(certificate.completionDate).toLocaleDateString()}`, { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(14).font('Helvetica').fillColor('#666').text(`Certificate ID: ${certificate.certificateId}`, { align: 'center' });

    // Signature area (modern)
    const y = doc.page.height - 140;
    doc.fontSize(14).font('Helvetica').fillColor('#222').text('_________________________', 100, y, { align: 'left' });
    doc.text(certificate.signatureName || 'Authorized Signature', 100, y + 20, { align: 'left' });
    doc.fontSize(12).fillColor('#1e293b').text('For Student Era', doc.page.width - 250, y + 20, { align: 'left' });
    const stampPath = path.join(__dirname, '../templates/stamp.png');
    if (fs.existsSync(stampPath)) {
      doc.opacity(0.5).image(stampPath, doc.page.width - 170, y - 10, { width: 70 }).opacity(1);
    }

    // Optional: QR code for verification (bottom right)
    // Uncomment if you want to add QR code support
    // const QRCode = require('qrcode');
    // const qrData = `https://studentera.live/verify-certificate/${certificate.certificateId}`;
    // QRCode.toDataURL(qrData, (err, url) => {
    //   if (!err) doc.image(url, doc.page.width - 120, doc.page.height - 120, { width: 80 });
    // });

    doc.end();
    stream.on('finish', () => resolve());
    stream.on('error', reject);
  });
}

module.exports = generateCertificatePDF; 