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
    const height = doc.page.height;
    const margin = 35;
    const usableWidth = width - (margin * 2);

    // Helper function to check for page breaks
    const checkPageBreak = (neededSpace) => {
      if (doc.y + neededSpace > height - margin) {
        doc.addPage();
        // Redraw Top Accent Bar on new page
        doc.rect(0, 0, width, 10).fill("#0A2463");
        doc.y = 40; // Reset y after new page
        return true;
      }
      return false;
    };

    // Top Accent Bar
    doc.rect(0, 0, width, 10).fill("#0A2463");

    // Header section
    doc.y = 40;
    const startY = doc.y;

    // Logo
    const newLogoPath = path.join(__dirname, "../templates/logo.png");
    const oldLogoPath = path.join(__dirname, "../templates/company-logo.png");
    const logoPath = offerLetter.companyLogo || (fs.existsSync(newLogoPath) ? newLogoPath : oldLogoPath);

    if (typeof logoPath === "string" && fs.existsSync(logoPath)) {
      doc.image(logoPath, margin, startY, { height: 45 });
    }

    // Company Info (Right Aligned)
    doc
      .text(offerLetter.company || "Student Era", margin, startY, { align: "right", width: usableWidth });

    doc
      .fontSize(9)
      .font("Helvetica")
      .fillColor("#6B7280")
      .moveDown(0.5)
      .text(offerLetter.companyAddress || "Patna, Bihar India, BR 800002", { align: "right", width: usableWidth });

    doc
      .text((offerLetter.companyEmail || "contact@studentera.online") + " | " + (offerLetter.companyWebsite || "www.studentera.online"), { align: "right", width: usableWidth });

    // Divider Line
    doc.moveDown(0.2).moveTo(margin, doc.y).lineTo(width - margin, doc.y).lineWidth(1.5).strokeColor("#E5E7EB").stroke();
    doc.y += 2;

    // Meta Info (Ref & Date)
    const formattedDate = offerLetter.issueDate
      ? new Date(offerLetter.issueDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
      : new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

    const metaY = doc.y;
    doc.fontSize(10).font("Helvetica-Bold").fillColor("#0A2463").text(`REF: ${offerLetter.referenceNo || "SE/INTERNSHIP/OFFER"}`, margin, metaY);
    doc.fillColor("#3E5C76").text(`Date: ${formattedDate}`, margin, metaY, { align: "right", width: usableWidth });

    // Subject
    doc.moveDown(0.5);
    doc.fontSize(18).font("Helvetica-Bold").fillColor("#0A2463").text("LETTER OF OFFER", { align: "center", underline: true });
    
    // Greeting
    doc.moveDown(0.8);
    doc.fontSize(11).font("Helvetica").fillColor("#1F2937").text("Dear ", margin, doc.y, { continued: true }).font("Helvetica-Bold").fillColor("#0A2463").text(`${offerLetter.candidateName || "Candidate"},`);
    
    // Intern ID Badge
    doc.moveDown(0.5);
    const idBadgeY = doc.y;
    doc.rect(margin, idBadgeY, 130, 20).fill("#EFF6FF");
    doc.fontSize(9).font("Helvetica-Bold").fillColor("#1E40AF").text(`Intern ID: ${offerLetter.internId || "NOT ASSIGNED"}`, margin + 10, idBadgeY + 5);
    doc.y = idBadgeY + 20;

    // Announcement
    doc.moveDown(0.8);
    doc.fontSize(12).font("Helvetica-Bold").fillColor("#0A2463").text("Congratulations! We are delighted to welcome you.");
    
    // Confidential Tag
    doc.moveDown(0.8);
    const confidentialY = doc.y;
    doc.rect(margin, confidentialY, usableWidth, 18).fill("#FEF2F2");
    doc.fontSize(8).font("Helvetica-Bold").fillColor("#B91C1C").text("STRICTLY PRIVATE & CONFIDENTIAL", margin, confidentialY + 5, { align: "center", characterSpacing: 1 });
    doc.y = confidentialY + 18;
    
    // Body Text
    doc.moveDown(0.8);
    doc.fontSize(10.5).font("Helvetica").fillColor("#374151").text(`Following your recent application and successful interview for the internship position, we are pleased to offer you an internship with `, { continued: true, lineGap: 2 }).font("Helvetica-Bold").text(`${offerLetter.company || "Student Era"}`, { continued: true }).font("Helvetica").text(`. We were impressed with your credentials and believe you will be a valuable addition to our team.`);
    
    doc.moveDown();

    // Stipend Box
    if (offerLetter.stipend && offerLetter.stipend > 0) {
      const stipendY = doc.y;
      doc.rect(margin, stipendY, usableWidth, 30).fill("#F0FDF4");
      doc.fontSize(10.5).font("Helvetica-Bold").fillColor("#15803D").text(`Stipend: Rs. ${offerLetter.stipend} / month`, margin + 15, stipendY + 10);
      doc.y = stipendY + 35;
    }

    // Terms
    doc.moveDown(0.5);
    const startFormatted = offerLetter.startDate ? new Date(offerLetter.startDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "________";
    
    const terms = [
      { label: "Position:", value: `You will be designated as ${offerLetter.title || "Intern"}.` },
      { label: "Commencement:", value: `Your internship will officially begin on ${startFormatted}.` },
      { label: "Mode of Work:", value: "The internship will be conducted in Work From Home (WFH) mode, with occasional requirements for office coordination." },
      { label: "Technology Partner:", value: `${offerLetter.techPartner || "Student Era"} shall be the official Technology Partner.` },
      { label: "Confidentiality:", value: "You must maintain absolute confidentiality regarding company projects and internal operations." },
      { label: "Responsibilities:", value: "You may be assigned cross-functional tasks to enhance your growth." },
      { label: "Withdrawal:", value: "The company reserves the right to withdraw this offer based on performance." }
    ];

    terms.forEach((term, i) => {
      checkPageBreak(25);
      doc.fontSize(9.5).font("Helvetica-Bold").fillColor("#111827").text(`${i + 1}. ${term.label}`, margin, doc.y, { continued: true }).font("Helvetica").fillColor("#374151").text(` ${term.value}`, { width: usableWidth - 20, lineGap: 1.5 });
      doc.y += 2;
    });

    doc.moveDown(0.5);
    checkPageBreak(40);
    doc.fontSize(10.5).font("Helvetica").text("Please signify your acceptance of this offer by signing and returning a copy of this letter. We look forward to a rewarding association.", { width: usableWidth, lineGap: 2 });

    // Signature Block - Ensure this stays together
    checkPageBreak(180);
    doc.moveDown(1);
    const signBlockY = doc.y;

    doc.font("Helvetica-Bold").fontSize(11).fillColor("#0A2463").text(`For ${offerLetter.company || "Student Era"}`, margin, signBlockY);

    if (offerLetter.hrSignature && fs.existsSync(offerLetter.hrSignature)) {
      doc.image(offerLetter.hrSignature, margin, signBlockY + 15, { height: 40 });
    }

    doc.font("Helvetica-Bold").fontSize(10).fillColor("#6B7280").text(`${offerLetter.hrName || "HR Name"}`, margin, signBlockY + 60);
    doc.font("Helvetica").fontSize(9).text("Human Resources Department", margin, signBlockY + 72);

    const stampPath = offerLetter.companyStamp || path.join(__dirname, "../templates/stamp.png");
    if (typeof stampPath === "string" && fs.existsSync(stampPath)) {
      doc.opacity(0.4).image(stampPath, margin + 130, signBlockY - 10, { width: 85 }).opacity(1);
    }

    // Acceptance Boxes
    const boxY = signBlockY + 90;
    const boxWidth = (usableWidth - 60) / 3;
    
    [ "Intern's Signature", "Date of Acceptance", "Institution / College" ].forEach((label, i) => {
        const xPos = margin + (i * (boxWidth + 30));
        doc.moveTo(xPos, boxY).lineTo(xPos + boxWidth, boxY).lineWidth(1).strokeColor("#E5E7EB").stroke();
        doc.fontSize(8).font("Helvetica-Bold").fillColor("#9CA3AF").text(label.toUpperCase(), xPos, boxY + 8, { width: boxWidth, align: "center" });
    });

    // Watermark (Add to all pages)
    const range = doc.bufferedPageRange();
    for (let i = range.start; i < range.start + range.count; i++) {
      doc.switchToPage(i);
      doc.save();
      doc.rotate(-35, { origin: [width / 2, height / 2] });
      doc.font("Helvetica-Bold").fontSize(80).fillColor("#0A2463").opacity(0.03).text(offerLetter.company || "Student Era", width / 2 - 400, height / 2 - 40, { align: "center", width: 800 });
      doc.opacity(1).restore();
    }

    doc.end();
    stream.on("finish", () => resolve());
    stream.on("error", reject);
  });
}

module.exports = generateOfferLetterPDF;
