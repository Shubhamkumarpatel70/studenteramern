const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

/**
 * Generate a professional PPO PDF
 * @param {Object} ppo - PPO data object
 * @param {string} outputPath - Path to save the generated PDF
 */
function generatePPOLetterPDF(ppo, outputPath) {
  return new Promise((resolve, reject) => {
    // A4 Portrait
    const doc = new PDFDocument({ margin: 50, size: "A4" });
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    const width = doc.page.width;
    const height = doc.page.height;
    const margin = 50;
    const usableWidth = width - (margin * 2);

    // Primary Colors
    const primaryColor = "#0A2463";
    const secondaryColor = "#3E5C76";
    const accentColor = "#4f46e5";
    const textColor = "#1f2937";
    const mutedTextColor = "#6b7280";

    // Helper function for page breaks
    const checkPageBreak = (neededSpace) => {
      if (doc.y + neededSpace > height - margin) {
        doc.addPage();
        doc.rect(0, 0, width, 10).fill(primaryColor);
        doc.y = 40;
        return true;
      }
      return false;
    };

    // Top Accent Bar
    doc.rect(0, 0, width, 10).fill(primaryColor);

    // Header
    doc.y = 40;
    const startY = doc.y;

    // Logo
    const logoPath = path.join(__dirname, "../templates/logo.png");
    const oldLogoPath = path.join(__dirname, "../templates/company-logo.png");
    const finalLogoPath = fs.existsSync(logoPath) ? logoPath : oldLogoPath;

    if (fs.existsSync(finalLogoPath)) {
      doc.image(finalLogoPath, margin, startY, { height: 50 });
    }

    // Company Info (Right)
    doc
      .fontSize(20)
      .font("Helvetica-Bold")
      .fillColor(primaryColor)
      .text(ppo.company || "Student Era", margin, startY, { align: "right", width: usableWidth });

    doc
      .fontSize(9)
      .font("Helvetica")
      .fillColor(mutedTextColor)
      .moveDown(0.5)
      .text("Patna, Bihar India, BR 800002", { align: "right", width: usableWidth });
    
    doc.text("www.studentera.online | contact@studentera.online", { align: "right", width: usableWidth });
    doc.text("CIN: U72900BR2022PTC058421", { align: "right", width: usableWidth });

    // Divider
    doc.moveDown(0.5).moveTo(margin, doc.y).lineTo(width - margin, doc.y).lineWidth(1).strokeColor("#E5E7EB").stroke();
    doc.y += 5;

    // Meta Info
    const formattedDate = ppo.issueDate
      ? new Date(ppo.issueDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
      : new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

    doc.fontSize(10).font("Helvetica-Bold").fillColor(secondaryColor).text(`REF: ${ppo.referenceNo || "SE/PPO/2024"}`, margin, doc.y);
    doc.text(`Date: ${formattedDate}`, margin, doc.y - 12, { align: "right", width: usableWidth });

    // Subject Box
    doc.moveDown(1);
    const subjectY = doc.y;
    doc.rect(margin, subjectY, usableWidth, 40).fill("#F3F4F6");
    doc.rect(margin, subjectY, 4, 40).fill(primaryColor);
    doc.fontSize(16).font("Helvetica-Bold").fillColor(primaryColor).text("PRE-PLACEMENT OFFER (PPO)", margin + 15, subjectY + 12, { align: "center", width: usableWidth - 30 });
    doc.y = subjectY + 50;

    // Greeting
    doc.fontSize(12).font("Helvetica").fillColor(textColor).text("Dear ", { continued: true }).font("Helvetica-Bold").fillColor(primaryColor).text(`${ppo.candidateName},`);
    
    // Intro
    doc.moveDown(1);
    doc.fontSize(11).font("Helvetica").fillColor(textColor).text(`We are thrilled to extend this formal Pre-Placement Offer (PPO) to you, following your exceptional performance during your internship with `, { continued: true, lineGap: 3 }).font("Helvetica-Bold").text(`${ppo.company || "Student Era"}`, { continued: true }).font("Helvetica").text(`. Your dedication, technical acumen, and cultural fit have significantly contributed to our team's success.`);

    // Offer Summary Box
    doc.moveDown(1);
    const summaryY = doc.y;
    doc.rect(margin, summaryY, usableWidth, 110).fill("#F0F9FF");
    doc.rect(margin, summaryY, usableWidth, 1).strokeColor("#BAE6FD").stroke();
    
    doc.fontSize(10).font("Helvetica-Bold").fillColor("#0369A1").text("OFFER SUMMARY", margin + 15, summaryY + 15);
    
    const gridY = summaryY + 40;
    // Row 1
    doc.fontSize(9).font("Helvetica-Bold").fillColor(mutedTextColor).text("DESIGNATION", margin + 15, gridY);
    doc.fontSize(11).font("Helvetica-Bold").fillColor(primaryColor).text(ppo.jobTitle || "Software Engineer", margin + 15, gridY + 12);
    
    doc.fontSize(9).font("Helvetica-Bold").fillColor(mutedTextColor).text("DEPARTMENT", margin + usableWidth/2 + 15, gridY);
    doc.fontSize(11).font("Helvetica-Bold").fillColor(primaryColor).text(ppo.department || "Engineering", margin + usableWidth/2 + 15, gridY + 12);

    // Row 2
    const gridY2 = gridY + 40;
    doc.fontSize(9).font("Helvetica-Bold").fillColor(mutedTextColor).text("JOINING DATE", margin + 15, gridY2);
    const joinDate = ppo.joiningDate ? new Date(ppo.joiningDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "TBD";
    doc.fontSize(11).font("Helvetica-Bold").fillColor(primaryColor).text(joinDate, margin + 15, gridY2 + 12);
    
    doc.fontSize(9).font("Helvetica-Bold").fillColor(mutedTextColor).text("WORK LOCATION", margin + usableWidth/2 + 15, gridY2);
    doc.fontSize(11).font("Helvetica-Bold").fillColor(primaryColor).text(ppo.workLocation || "Remote / Office", margin + usableWidth/2 + 15, gridY2 + 12);

    doc.y = summaryY + 120;

    // Compensation
    doc.fontSize(12).font("Helvetica-Bold").fillColor(primaryColor).text("Compensation & Benefits");
    doc.moveDown(0.5);
    doc.fontSize(11).font("Helvetica").fillColor(textColor).text("Your annual total compensation package is designed to reward your expertise and potential.");
    
    doc.moveDown(0.5);
    const ctcY = doc.y;
    doc.rect(margin, ctcY, usableWidth, 45).fill("#F0FDF4");
    doc.rect(margin, ctcY, usableWidth, 1).strokeColor("#BBF7D0").stroke();
    doc.fontSize(11).font("Helvetica-Bold").fillColor("#166534").text("Annual Cost to Company (CTC)", margin + 15, ctcY + 16);
    doc.fontSize(18).font("Helvetica-Bold").fillColor("#15803D").text(`Rs. ${ppo.ctc}`, margin, ctcY + 13, { align: "right", width: usableWidth - 15 });
    
    doc.y = ctcY + 55;

    // Terms
    doc.fontSize(12).font("Helvetica-Bold").fillColor(primaryColor).text("Terms of Employment");
    doc.moveDown(0.5);
    const terms = [
      `Probation: You will be on a probation period of ${ppo.probationPeriod || "6 Months"}, during which your performance will be reviewed.`,
      "Confidentiality: You agree to maintain the highest level of confidentiality regarding company secrets, client data, and proprietary technology.",
      "Notice Period: Post-confirmation, a notice period of 60 days will be applicable for either party to terminate the employment.",
      "Code of Conduct: You are expected to adhere to the professional standards and code of ethics as defined in the Employee Handbook."
    ];

    terms.forEach((term, i) => {
      checkPageBreak(30);
      doc.fontSize(10).font("Helvetica").fillColor(textColor).text(`• ${term}`, { lineGap: 4 });
    });

    // Signature Block
    checkPageBreak(150);
    doc.moveDown(1.5);
    const sigBlockY = doc.y;

    // HR Signature
    doc.moveTo(margin, sigBlockY + 50).lineTo(margin + 200, sigBlockY + 50).lineWidth(1.5).strokeColor(primaryColor).stroke();
    doc.fontSize(11).font("Helvetica-Bold").fillColor(primaryColor).text(ppo.hrName || "HR Manager", margin, sigBlockY + 58);
    doc.fontSize(9).font("Helvetica").fillColor(mutedTextColor).text(`Head of Human Resources\n${ppo.company || "Student Era"}`, margin, sigBlockY + 72);

    // Stamp
    const stampPath = path.join(__dirname, "../templates/stamp.png");
    if (fs.existsSync(stampPath)) {
      doc.opacity(0.15).image(stampPath, width/2 - 40, sigBlockY + 10, { width: 80 }).opacity(1);
    }

    // Candidate Signature
    doc.moveTo(width - margin - 200, sigBlockY + 50).lineTo(width - margin, sigBlockY + 50).lineWidth(1.5).strokeColor(primaryColor).stroke();
    doc.fontSize(11).font("Helvetica-Bold").fillColor(primaryColor).text("Accepted By", width - margin - 200, sigBlockY + 58, { width: 200, align: "center" });
    doc.fontSize(9).font("Helvetica").fillColor(mutedTextColor).text(`${ppo.candidateName}\nDate: _______________`, width - margin - 200, sigBlockY + 72, { width: 200, align: "center" });

    // Watermark
    const range = doc.bufferedPageRange();
    for (let i = range.start; i < range.start + range.count; i++) {
      doc.switchToPage(i);
      doc.save();
      doc.rotate(-35, { origin: [width / 2, height / 2] });
      doc.font("Helvetica-Bold").fontSize(80).fillColor(primaryColor).opacity(0.03).text(ppo.company || "Student Era", width / 2 - 400, height / 2 - 40, { align: "center", width: 800 });
      doc.opacity(1).restore();
    }

    doc.end();
    stream.on("finish", () => resolve());
    stream.on("error", reject);
  });
}

module.exports = generatePPOLetterPDF;
