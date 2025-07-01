const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function generateOfferLetterPDF(offerLetter, outputPath) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    // Watermark
    doc.save();
    doc.rotate(-30, { origin: [doc.page.width / 2, doc.page.height / 2] });
    doc.font('Helvetica-Bold')
      .fontSize(90)
      .fillColor('#4f46e5')
      .opacity(0.07)
      .text('Student Era', doc.page.width / 2 - 300, doc.page.height / 2 - 50, {
        align: 'center',
        width: 600
      });
    doc.opacity(1).restore();

    // Header: Centered logo and company info
    const logoPath = path.join(__dirname, '../templates/company-logo.png');
    if (typeof logoPath === 'string' && fs.existsSync(logoPath)) {
      doc.image(logoPath, doc.page.width / 2 - 60, 40, { width: 120 });
    } else {
      console.warn('Logo path is not a string or does not exist:', logoPath);
    }
    doc.fontSize(24).font('Helvetica-Bold').fillColor('#4f46e5').text('Student Era', 0, 170, { align: 'center' });
    doc.fontSize(12).font('Helvetica').fillColor('#444').text('D-107, 91Springboard, Vyapar Marg, Sector-2, Noida, UP 201301', { align: 'center' });
    doc.text('info@studentera.com | www.studentera.com', { align: 'center' });

    // Accent line
    doc.moveDown(1);
    doc.strokeColor('#4f46e5').lineWidth(3).moveTo(60, 220).lineTo(doc.page.width - 60, 220).stroke();
    doc.moveDown(1);

    // Reference, Date, and Heading
    doc.fontSize(12).font('Helvetica').fillColor('black').text('REF: SE/INTERNSHIP/OFFER', 60, 235, { align: 'left' });
    doc.font('Helvetica-Bold').text('LETTER OF OFFER', 0, 235, { align: 'center', underline: true });
    doc.font('Helvetica').text(`Dated: ${new Date(offerLetter.issueDate).toLocaleDateString()}`, doc.page.width - 220, 235, { align: 'left' });

    doc.moveDown(2);
    doc.fontSize(14).font('Helvetica-Bold').text(`Dear ${offerLetter.candidateName || 'Candidate'},`, 60, 270, { align: 'left' });
    doc.font('Helvetica').text(`Intern ID: ${offerLetter.internId || '__________'}`, { align: 'left' });
    doc.moveDown(0.5);
    doc.font('Helvetica-Bold').text('Congratulations!!', { align: 'left' });

    doc.moveDown(1);
    doc.font('Helvetica-Bold').fontSize(13).text('STRICTLY PRIVATE & CONFIDENTIAL', { align: 'center', underline: true });
    doc.moveDown(0.5);
    doc.font('Helvetica').fontSize(11).text(
      'We are pleased to offer you a Summer Internship with Student Era, based on your application and the interview & discussions you had with us. Details of the terms & conditions of offer are as under:',
      { align: 'left' }
    );
    doc.moveDown(0.5);
    const terms = [
      'You must always maintain utmost secrecy and confidentiality of your offer, its terms, and of any information about the company, and shall not disclose any such details to outsiders.',
      `You will be designated as ${offerLetter.title || 'Intern'}.`,
      `Your date of commencement of internship will be from ${offerLetter.startDate || '__________'} in WFH mode.`,
      'You will be entitled to receive compensation and benefits as discussed at the time of interview.',
      'You agree to work in both work environments i.e., WFH, Work from office.',
      `${offerLetter.techPartner || 'Our Technology Partner'} shall be the official Technology Partner for this internship.`,
      'The company reserves all rights to withdraw this internship offer at any time without giving any reasons.',
      'In addition to core responsibilities of this internship, the company may assign additional tasks or projects based on operational needs and availability. The intern is expected to contribute effectively to such assignments as per the company\'s discretion.'
    ];
    terms.forEach((term, i) => {
      doc.text(`${i + 1}. ${term}`, { indent: 10, align: 'left' });
    });
    doc.moveDown(0.5);
    doc.text('9. Kindly sign and return a copy of this letter as a token of your acceptance of the offer.', { indent: 10, align: 'left' });
    doc.moveDown(1);
    doc.text('Looking forward to a long and mutually beneficial career with us', { align: 'left' });

    // Horizontal line before signature area
    doc.moveDown(1);
    doc.strokeColor('#888').lineWidth(1).moveTo(60, doc.y).lineTo(doc.page.width - 60, doc.y).stroke();
    doc.moveDown(1);

    // Signature area (modern)
    doc.fontSize(12).font('Helvetica').text(`${offerLetter.hrName || 'N. Kumar (Sr. HR-Manager)'}`, 60, doc.y, { continued: true });
    doc.text('Applicant Sign', 260, doc.y, { continued: true });
    doc.text('College', 400, doc.y, { continued: true });
    doc.text('Location', 520, doc.y);

    doc.moveDown(2);
    // For Student Era + Stamp
    doc.fontSize(11).text('For Student Era', 60, doc.y, { align: 'left' });
    const stampPath = path.join(__dirname, '../templates/stamp.png');
    if (typeof stampPath === 'string' && fs.existsSync(stampPath)) {
      doc.opacity(0.5).image(stampPath, 180, doc.y - 20, { width: 60 }).opacity(1);
    } else {
      console.warn('Stamp path is not a string or does not exist:', stampPath);
    }

    doc.end();
    stream.on('finish', () => resolve());
    stream.on('error', reject);
  });
}

module.exports = generateOfferLetterPDF; 