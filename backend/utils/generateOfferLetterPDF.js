const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

function generateOfferLetterPDF(offerLetter, outputPath) {
  return new Promise((resolve, reject) => {
    // Elegant A4 Portrait
    const doc = new PDFDocument({ margin: 50, size: "A4" });
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    const width = doc.page.width;

    // Top Accent Bar
    doc.rect(0, 0, width, 8).fill("#4f46e5");

    // Header: Logo Top Left, Company Top Right
    const newLogoPath = path.join(__dirname, "../templates/logo.png");
    const oldLogoPath = path.join(__dirname, "../templates/company-logo.png");
    const logoPath = offerLetter.companyLogo || (fs.existsSync(newLogoPath) ? newLogoPath : oldLogoPath);

    const headerY = 40;

    if (typeof logoPath === "string" && fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, headerY, { width: 60 });
    }

    doc
      .fontSize(24)
      .font("Helvetica-Bold")
      .fillColor("#0f172a")
      .text(offerLetter.company || "Student Era", 50, headerY + 10, { align: "right", width: width - 100 });

    doc
      .fontSize(10)
      .font("Helvetica")
      .fillColor("#64748b")
      .text(offerLetter.companyAddress || "Patna, Bihar India, BR 800002", 50, headerY + 40, { align: "right", width: width - 100 });

    doc
      .text((offerLetter.companyEmail || "contact.studentera@gmail.com") + " | " + (offerLetter.companyWebsite || "www.studentera.com"), 50, headerY + 55, { align: "right", width: width - 100 });

    // Divider
    doc.moveTo(50, headerY + 85).lineTo(width - 50, headerY + 85).lineWidth(1).strokeColor("#e2e8f0").stroke();

    // Reference & Date
    let currentY = headerY + 110;

    const formattedDate = offerLetter.issueDate
      ? new Date(offerLetter.issueDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
      : "N/A";

    doc.fontSize(11).font("Helvetica-Bold").fillColor("#475569").text(`REF: ${offerLetter.referenceNo || "SE/INTERNSHIP/OFFER"}`, 50, currentY);
    doc.text(`Date: ${formattedDate}`, 50, currentY, { align: "right", width: width - 100 });

    currentY += 40;

    // Subject
    doc.fontSize(16).font("Helvetica-Bold").fillColor("#0f172a").text("LETTER OF OFFER", 0, currentY, { align: "center", tracking: 1 });
    currentY += 40;

    // Greeting
    doc.fontSize(12).font("Helvetica").fillColor("#334155").text(`Dear `, 50, currentY, { continued: true }).font("Helvetica-Bold").fillColor("#0f172a").text(`${offerLetter.candidateName || "Candidate"},`);
    currentY += 20;
    doc.fontSize(11).font("Helvetica").fillColor("#64748b").text(`Intern ID: ${offerLetter.internId || "________"}`);
    currentY += 25;

    doc.fontSize(12).font("Helvetica-Bold").fillColor("#0f172a").text("Congratulations!");
    currentY += 20;

    doc.fontSize(11).font("Helvetica-Bold").fillColor("#b91c1c").text("STRICTLY PRIVATE & CONFIDENTIAL", 0, currentY, { align: "center" });
    currentY += 25;

    // Body
    doc.fontSize(11).font("Helvetica").fillColor("#334155").text(`We are pleased to offer you an Internship with ${offerLetter.company || "Student Era"}, based on your application and interview. Details of the terms & conditions of the offer are as under:`, 50, currentY, { lineGap: 4 });
    currentY += 40;

    if (offerLetter.stipend && offerLetter.stipend > 0) {
      doc.fontSize(12).font("Helvetica-Bold").fillColor("#4f46e5").text(`Stipend: \u20B9${offerLetter.stipend} /${offerLetter.stipendType || "month"}`);
      currentY += 25;
    }

    const startFormatted = offerLetter.startDate ? new Date(offerLetter.startDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "________";

    const terms = [
      "You must always maintain utmost secrecy and confidentiality of your offer, its terms, and of any information about the company, and shall not disclose any such details to outsiders.",
      `You will be designated as ${offerLetter.title || "Intern"}.`,
      `Your date of commencement of internship will be from ${startFormatted} in WFH mode.`,
      "You will be entitled to receive compensation and benefits as discussed at the time of interview.",
      "You agree to work in both work environments i.e., WFH, Work from office.",
      `${offerLetter.techPartner || "Student Era"} shall be the official Technology Partner for this internship.`,
      "The company reserves all rights to withdraw this internship offer at any time without giving any reasons.",
      "In addition to core responsibilities of this internship, the company may assign additional tasks or projects based on operational needs and availability. The intern is expected to contribute effectively to such assignments as per the company's discretion.",
    ];

    doc.fontSize(11).fillColor("#334155");
    terms.forEach((term, i) => {
      doc.text(`${i + 1}.`, 50, currentY);
      doc.text(term, 70, currentY, { width: width - 120, lineGap: 3 });
      currentY = doc.y + 8;
    });

    currentY += 10;
    doc.text("Kindly sign and return a copy of this letter as a token of your acceptance of the offer.", 50, currentY, { lineGap: 3 });
    currentY += 20;

    doc.font("Helvetica-Bold").text("Looking forward to a long and mutually beneficial career with us.", 50, currentY);
    currentY += 40;

    // Signatures
    const signY = currentY;

    doc.font("Helvetica-Bold").fillColor("#0f172a").text(`For ${offerLetter.company || "Student Era"}`, 50, signY);

    if (offerLetter.hrSignature && fs.existsSync(offerLetter.hrSignature)) {
      doc.image(offerLetter.hrSignature, 50, signY + 15, { width: 80 });
    }

    doc.font("Helvetica").fontSize(10).fillColor("#64748b").text(`${offerLetter.hrName || "HR Name"} (HR)`, 50, signY + 60);

    const stampPath = offerLetter.companyStamp || path.join(__dirname, "../templates/stamp.png");
    if (typeof stampPath === "string" && fs.existsSync(stampPath)) {
      doc.opacity(0.4).image(stampPath, 200, signY, { width: 70 }).opacity(1);
    }

    // Bottom Intern Signature boxes
    const sigLineY = signY + 110;
    doc.moveTo(50, sigLineY + 12).lineTo(180, sigLineY + 12).strokeColor("#cbd5e1").stroke();
    doc.font("Helvetica").fontSize(10).fillColor("#64748b").text("Intern's Signature", 50, signY + 125);

    doc.moveTo(220, sigLineY + 12).lineTo(380, sigLineY + 12).strokeColor("#cbd5e1").stroke();
    doc.text("Date", 220, signY + 125);

    doc.moveTo(420, sigLineY + 12).lineTo(width - 50, sigLineY + 12).strokeColor("#cbd5e1").stroke();
    doc.text("College", 420, signY + 125);


    // Watermark
    doc.save();
    doc.rotate(-30, { origin: [width / 2, doc.page.height / 2] });
    doc.font("Helvetica-Bold").fontSize(100).fillColor("#4f46e5").opacity(0.02).text("Student Era", width / 2 - 300, doc.page.height / 2 - 50, { align: "center", width: 600 });
    doc.opacity(1).restore();

    doc.end();
    stream.on("finish", () => resolve());
    stream.on("error", reject);
  });
}

module.exports = generateOfferLetterPDF;
