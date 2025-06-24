const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function generateOfferLetterPDF(offerLetter, outputPath) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    // Header: Logo and Company Info (centered)
    const logoPath = path.join(__dirname, '../templates/company-logo.png');
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, doc.page.width / 2 - 40, 40, { width: 80 });
    }
    doc.moveDown(2);
    doc.fontSize(18).font('Helvetica-Bold').text('Student Era', { align: 'center' });
    doc.fontSize(10).font('Helvetica').text('D-107, 91Springboard, Vyapar Marg, Sector-2, Noida, UP 201301', { align: 'center' });
    doc.text('info@studentera.com | www.studentera.com', { align: 'center' });

    doc.moveDown(1);
    doc.strokeColor('#888').lineWidth(1).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
    doc.moveDown(1);

    // Reference, Date, and Heading
    doc.fontSize(11).font('Helvetica').text('REF: SE/INTERNSHIP/OFFER', { align: 'left' });
    doc.font('Helvetica-Bold').text('LETTER OF OFFER', { align: 'left', underline: true });
    doc.font('Helvetica').text(`Dated: ${new Date(offerLetter.issueDate).toLocaleDateString()}`, { align: 'right' });

    doc.moveDown(1.5);
    doc.fontSize(12).font('Helvetica-Bold').text(`Dear ${offerLetter.candidateName || 'Candidate'},`, { align: 'left' });
    doc.font('Helvetica').text(`Intern ID: ${offerLetter.internId || '__________'}`, { align: 'left' });
    doc.moveDown(0.5);
    doc.font('Helvetica-Bold').text('Congratulations!!', { align: 'left' });

    doc.moveDown(1);
    doc.font('Helvetica-Bold').fontSize(12).text('STRICTLY PRIVATE & CONFIDENTIAL', { align: 'center', underline: true });
    doc.moveDown(0.5);
    doc.font('Helvetica').fontSize(10).text(
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
    doc.strokeColor('#888').lineWidth(1).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
    doc.moveDown(1);

    // Signature area
    doc.fontSize(11).font('Helvetica').text('N. Kumar (Sr. HR-Manager)', 50, doc.y, { continued: true });
    doc.text('Applicant Sign', 220, doc.y, { continued: true });
    doc.text('College', 350, doc.y, { continued: true });
    doc.text('Location', 450, doc.y);

    doc.moveDown(2);
    doc.fontSize(10).text('For Student Era', { align: 'left' });

    doc.end();
    stream.on('finish', () => resolve());
    stream.on('error', reject);
  });
}

module.exports = generateOfferLetterPDF; 