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
    doc.rect(0, 0, width, 10).fill("#0A2463");

    // Header Y position
    let currentY = 40;

    // Logo & Company Info
    const newLogoPath = path.join(__dirname, "../templates/logo.png");
    const oldLogoPath = path.join(__dirname, "../templates/company-logo.png");
    const logoPath = offerLetter.companyLogo || (fs.existsSync(newLogoPath) ? newLogoPath : oldLogoPath);

    if (typeof logoPath === "string" && fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, currentY, { height: 45 });
    }

    doc
      .fontSize(18)
      .font("Helvetica-Bold")
      .fillColor("#0A2463")
      .text(offerLetter.company || "Student Era", 50, currentY, { align: "right", width: width - 100 });

    doc
      .fontSize(9)
      .font("Helvetica")
      .fillColor("#6B7280")
      .text(offerLetter.companyAddress || "Patna, Bihar India, BR 800002", 50, currentY + 25, { align: "right", width: width - 100 });

    doc
      .text((offerLetter.companyEmail || "contact@studentera.online") + " | " + (offerLetter.companyWebsite || "www.studentera.online"), 50, currentY + 40, { align: "right", width: width - 100 });

    // Divider Line
    currentY += 75;
    doc.moveTo(50, currentY).lineTo(width - 50, currentY).lineWidth(1.5).strokeColor("#E5E7EB").stroke();

    // Meta Info (Ref & Date)
    currentY += 25;
    const formattedDate = offerLetter.issueDate
      ? new Date(offerLetter.issueDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
      : "N/A";

    doc.fontSize(10).font("Helvetica-Bold").fillColor("#0A2463").text(`REF: ${offerLetter.referenceNo || "SE/INTERNSHIP/OFFER"}`, 50, currentY);
    doc.fillColor("#3E5C76").text(`Date: ${formattedDate}`, 50, currentY, { align: "right", width: width - 100 });

    // Subject
    currentY += 50;
    doc.fontSize(20).font("Helvetica-Bold").fillColor("#0A2463").text("LETTER OF OFFER", 0, currentY, { align: "center", underline: true });
    
    // Greeting
    currentY += 50;
    doc.fontSize(12).font("Helvetica").fillColor("#1F2937").text("Dear ", 50, currentY, { continued: true }).font("Helvetica-Bold").fillColor("#0A2463").text(`${offerLetter.candidateName || "Candidate"},`);
    
    // Intern ID Badge
    currentY += 30;
    doc.rect(50, currentY, 150, 22).fill("#EFF6FF");
    doc.fontSize(10).font("Helvetica-Bold").fillColor("#1E40AF").text(`Intern ID: ${offerLetter.internId || "NOT ASSIGNED"}`, 60, currentY + 6);
    
    // Announcement
    currentY += 45;
    doc.fontSize(13).font("Helvetica-Bold").fillColor("#0A2463").text("Congratulations! We are delighted to welcome you.");
    
    // Confidential Tag
    currentY += 30;
    doc.rect(50, currentY, width - 100, 20).fill("#FEF2F2");
    doc.fontSize(9).font("Helvetica-Bold").fillColor("#B91C1C").text("STRICTLY PRIVATE & CONFIDENTIAL", 0, currentY + 6, { align: "center", characterSpacing: 1 });
    
    // Body Text
    currentY += 40;
    doc.fontSize(11).font("Helvetica").fillColor("#374151").text(`Following your recent application and successful interview for the internship position, we are pleased to offer you an internship with `, 50, currentY, { continued: true, lineGap: 3 }).font("Helvetica-Bold").text(`${offerLetter.company || "Student Era"}`, { continued: true }).font("Helvetica").text(`. We were impressed with your credentials and believe you will be a valuable addition to our team.`);
    
    currentY = doc.y + 20;

    // Stipend Box
    if (offerLetter.stipend && offerLetter.stipend > 0) {
      doc.rect(50, currentY, width - 100, 35).fill("#F0FDF4");
      doc.fontSize(11).font("Helvetica-Bold").fillColor("#15803D").text(`Stipend: \u20B9${offerLetter.stipend} / month`, 65, currentY + 12);
      currentY += 55;
    } else {
        currentY += 10;
    }

    // Terms
    const startFormatted = offerLetter.startDate ? new Date(offerLetter.startDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "________";
    
    const terms = [
      { label: "Position:", value: `You will be designated as ${offerLetter.title || "Intern"}.` },
      { label: "Commencement:", value: `Your internship will officially begin on ${startFormatted}.` },
      { label: "Mode of Work:", value: "The internship will be conducted in Work From Home (WFH) mode, with occasional requirements for office coordination if necessary." },
      { label: "Technology Partner:", value: `${offerLetter.techPartner || "Student Era"} shall be the official Technology Partner for this program.` },
      { label: "Confidentiality:", value: "You must maintain absolute confidentiality regarding company projects, intellectual property, and internal operations. Disclosure to any third party is strictly prohibited." },
      { label: "Responsibilities:", value: "In addition to your core domain, you may be assigned cross-functional tasks to enhance your professional growth." },
      { label: "Withdrawal:", value: "The company reserves the right to terminate or withdraw this offer at its discretion based on performance or organizational requirements." }
    ];

    terms.forEach((term, i) => {
      doc.fontSize(10).font("Helvetica-Bold").fillColor("#111827").text(`${i + 1}. ${term.label}`, 50, currentY, { continued: true }).font("Helvetica").fillColor("#374151").text(` ${term.value}`, { width: width - 120, lineGap: 4 });
      currentY = doc.y + 10;
    });

    currentY += 15;
    doc.fontSize(11).font("Helvetica").text("Please signify your acceptance of this offer by signing and returning a copy of this letter. We look forward to a productive and mutually rewarding association.", 50, currentY, { width: width - 100, lineGap: 3 });

    // Signatures
    currentY += 60;
    const signY = currentY;

    doc.font("Helvetica-Bold").fontSize(11).fillColor("#0A2463").text(`For ${offerLetter.company || "Student Era"}`, 50, signY);

    if (offerLetter.hrSignature && fs.existsSync(offerLetter.hrSignature)) {
      doc.image(offerLetter.hrSignature, 50, signY + 15, { height: 40 });
    }

    doc.font("Helvetica-Bold").fontSize(10).fillColor("#6B7280").text(`${offerLetter.hrName || "HR Name"}`, 50, signY + 60);
    doc.font("Helvetica").fontSize(9).text("Human Resources Department", 50, signY + 72);

    const stampPath = offerLetter.companyStamp || path.join(__dirname, "../templates/stamp.png");
    if (typeof stampPath === "string" && fs.existsSync(stampPath)) {
      doc.opacity(0.4).image(stampPath, 180, signY - 10, { width: 85 }).opacity(1);
    }

    // Acceptance Boxes
    const boxY = signY + 130;
    const boxWidth = (width - 160) / 3;
    
    [ "Intern's Signature", "Date of Acceptance", "Institution / College" ].forEach((label, i) => {
        const xPos = 50 + (i * (boxWidth + 30));
        doc.moveTo(xPos, boxY).lineTo(xPos + boxWidth, boxY).lineWidth(1).strokeColor("#E5E7EB").stroke();
        doc.fontSize(8).font("Helvetica-Bold").fillColor("#9CA3AF").text(label.toUpperCase(), xPos, boxY + 8, { width: boxWidth, align: "center" });
    });

    // Watermark
    doc.save();
    doc.rotate(-35, { origin: [width / 2, doc.page.height / 2] });
    doc.font("Helvetica-Bold").fontSize(100).fillColor("#0A2463").opacity(0.03).text(offerLetter.company || "Student Era", width / 2 - 400, doc.page.height / 2 - 50, { align: "center", width: 800 });
    doc.opacity(1).restore();

    doc.end();
    stream.on("finish", () => resolve());
    stream.on("error", reject);
  });
}

module.exports = generateOfferLetterPDF;
