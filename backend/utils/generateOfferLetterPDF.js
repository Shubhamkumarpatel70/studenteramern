const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function generateOfferLetterPDF(offerLetter, outputPath) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    // Header: Logo top left, company details top right
    const logoPath = offerLetter.companyLogo || path.join(__dirname, '../templates/company-logo.png');
    const headerY = 30;
    if (typeof logoPath === 'string' && fs.existsSync(logoPath)) {
      doc.image(logoPath, 30, headerY, { width: 80 });
    }
    // Company details top right
    const companyDetailsX = doc.page.width - 320;
    doc.fontSize(22).font('Helvetica-Bold').fillColor('#4f46e5').text(offerLetter.company || 'Company Name', companyDetailsX, headerY, { width: 290, align: 'right' });
    doc.fontSize(11).font('Helvetica').fillColor('#444').text(
      offerLetter.companyAddress || 'Patna, Bihar India, BR 800002 contact.studentera@gmail.com',
      companyDetailsX, headerY + 28, { width: 290, align: 'right' }
    );
    doc.fontSize(11).fillColor('#666').text((offerLetter.companyEmail ? offerLetter.companyEmail + ' | ' : '') + (offerLetter.companyWebsite || ''), companyDetailsX, headerY + 46, { width: 290, align: 'right' });

    // Accent line below header
    doc.moveTo(30, headerY + 70).lineTo(doc.page.width - 30, headerY + 70).lineWidth(2).strokeColor('#4f46e5').stroke();
    // Main heading: LETTER OF OFFER (centered)
    doc.font('Helvetica-Bold').fontSize(22).fillColor('#4f46e5').text('LETTER OF OFFER', 0, headerY + 80, { align: 'center', underline: true });
    // Sub-header: REF and Dated (centered, below heading)
    let subHeaderY = headerY + 110;
    doc.font('Helvetica').fontSize(12).fillColor('black').text(`REF: ${offerLetter.referenceNo || 'SE/INTERNSHIP/OFFER'}    Dated: ${offerLetter.issueDate ? new Date(offerLetter.issueDate).toLocaleDateString() : ''}`, 0, subHeaderY, { align: 'center' });
    let contentY = subHeaderY + 30;
    doc.fontSize(15).font('Helvetica-Bold').fillColor('#0e7490').text(`Dear ${offerLetter.candidateName || 'Candidate'},`, 60, contentY, { align: 'left' });
    contentY += 22;
    doc.font('Helvetica').fontSize(12).fillColor('#222').text(`Intern ID: ${offerLetter.internId || '__________'}`, 60, contentY, { align: 'left' });
    contentY += 18;
    doc.font('Helvetica-Bold').fontSize(14).fillColor('#1e293b').text('Congratulations!!', 60, contentY, { align: 'left' });
    contentY += 24;
    doc.font('Helvetica-Bold').fontSize(13).fillColor('#4f46e5').text('STRICTLY PRIVATE & CONFIDENTIAL', 0, contentY, { align: 'center', underline: true });
    contentY += 22;
    doc.font('Helvetica').fontSize(12).fillColor('black').text(
      `We are pleased to offer you a Summer Internship with ${offerLetter.company || 'the company'}, based on your application and the interview & discussions you had with us. Details of the terms & conditions of offer are as under:`,
      60, contentY, { align: 'left', width: doc.page.width - 120 }
    );
    contentY += 32;
    // Stipend (if present) - after intro paragraph, clear and bold
    if (offerLetter.stipend && offerLetter.stipend > 0) {
      contentY += 18;
      // Use Unicode for Indian Rupee symbol (U+20B9) to ensure proper rendering
      const rupeeSymbol = '\u20B9';
      doc.font('Helvetica-Bold').fontSize(13).fillColor('#1976d2').text(`Stipend: ${rupeeSymbol}${offerLetter.stipend} /${offerLetter.stipendType || 'month'}`.replace(/\s+/g, ' '), 60, contentY, { align: 'left' });
      contentY += 18;
    }
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
    doc.fontSize(12).fillColor('#222');
    terms.forEach((term, i) => {
      doc.text(`${i + 1}. ${term}`, 80, doc.y + 2, { width: doc.page.width - 160, lineGap: 2 });
    });
    doc.moveDown(0.5);
    doc.text('9. Kindly sign and return a copy of this letter as a token of your acceptance of the offer.', 80, doc.y + 2, { width: doc.page.width - 160, lineGap: 2 });
    doc.moveDown(1);
    doc.text('Looking forward to a long and mutually beneficial career with us', 60, doc.y + 2, { align: 'left' });
    doc.moveDown(1);
    doc.strokeColor('#888').lineWidth(1).moveTo(60, doc.y).lineTo(doc.page.width - 60, doc.y).stroke();
    doc.moveDown(1);
    // Signature and stamp area: side by side
    const signY = doc.y + 10;
    // Signature block (left)
    doc.fontSize(11).font('Helvetica-Bold').fillColor('#1e293b').text(`For ${offerLetter.company || 'the company'}`, 60, signY, { align: 'left' });
    if (offerLetter.hrSignature && fs.existsSync(offerLetter.hrSignature)) {
      doc.image(offerLetter.hrSignature, 60, signY + 18, { width: 80 });
    }
    doc.font('Helvetica').fontSize(11).fillColor('#222').text(`${offerLetter.hrName || 'HR Name (HR)'}`, 60, signY + 38, { align: 'left' });
    // Stamp (right)
    const stampPath = offerLetter.companyStamp || path.join(__dirname, '../templates/stamp.png');
    if (typeof stampPath === 'string' && fs.existsSync(stampPath)) {
      doc.opacity(0.5).image(stampPath, doc.page.width - 140, signY, { width: 80 }).opacity(1);
    } else {
      console.warn('Stamp path is not a string or does not exist:', stampPath);
    }
    // Signature lines for Intern and College
    const sigLineY = signY + 80;
    doc.font('Helvetica').fontSize(11).fillColor('#222').text("Intern's Signature", 60, sigLineY, { align: 'left' });
    doc.moveTo(160, sigLineY + 12).lineTo(300, sigLineY + 12).strokeColor('#888').lineWidth(1).stroke();
    doc.font('Helvetica').fontSize(11).fillColor('#222').text('College', 320, sigLineY, { align: 'left' });
    doc.moveTo(380, sigLineY + 12).lineTo(520, sigLineY + 12).strokeColor('#888').lineWidth(1).stroke();

    // Watermark (behind all content)
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

    doc.end();
    stream.on('finish', () => resolve());
    stream.on('error', reject);
  });
}

module.exports = generateOfferLetterPDF; 