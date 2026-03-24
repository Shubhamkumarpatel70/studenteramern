const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

function generateCertificatePDF(certificate, outputPath) {
  return new Promise((resolve, reject) => {
    // A4 Landscape: 841.89 x 595.28 points
    const doc = new PDFDocument({
      margin: 0,
      size: "A4",
      layout: "landscape",
    });
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    const width = doc.page.width;
    const height = doc.page.height;

    // Elegant Background
    doc.rect(0, 0, width, height).fill("#ffffff");

    // Decorative Top & Bottom Borders (Minimal Corporate Style)
    doc.rect(0, 0, width, 15).fill("#4f46e5"); // Top banner primary
    doc.rect(0, height - 15, width, 15).fill("#1e293b"); // Bottom banner dark slate

    // Inner subtle border
    doc.rect(20, 35, width - 40, height - 70).lineWidth(1).stroke("#e2e8f0");

    // Watermark
    doc.save();
    doc.rotate(-30, { origin: [width / 2, height / 2] });
    doc
      .font("Helvetica-Bold")
      .fontSize(120)
      .fillColor("#4f46e5")
      .opacity(0.03)
      .text("Student Era", width / 2 - 400, height / 2 - 60, {
        align: "center",
        width: 800,
      });
    doc.opacity(1).restore();

    // Centered Logo
    const newLogoPath = path.join(__dirname, "../templates/logo.png");
    const oldLogoPath = path.join(__dirname, "../templates/company-logo.png");
    const logoPath = fs.existsSync(newLogoPath) ? newLogoPath : oldLogoPath;

    let currentY = 75;

    if (fs.existsSync(logoPath)) {
      const logoSize = 75;
      const logoX = width / 2 - logoSize / 2;

      doc.save();
      doc.circle(logoX + logoSize / 2, currentY + logoSize / 2, logoSize / 2).clip();
      doc.image(logoPath, logoX, currentY, { width: logoSize, height: logoSize });
      doc.restore();
      currentY += 95;
    } else {
      currentY += 40;
    }

    // Title
    doc
      .fontSize(32)
      .font("Helvetica-Bold")
      .fillColor("#0f172a")
      .text("CERTIFICATE OF COMPLETION", 0, currentY, { align: "center", tracking: 2 });
    currentY += 45;

    doc
      .fontSize(14)
      .font("Helvetica")
      .fillColor("#64748b")
      .text("This is to certify that", 0, currentY, { align: "center" });
    currentY += 30;

    // Candidate Name
    doc
      .fontSize(42)
      .font("Helvetica-Bold")
      .fillColor("#4f46e5")
      .text(certificate.candidateName, 0, currentY, { align: "center" });
    currentY += 60;

    // Description text
    doc
      .fontSize(14)
      .font("Helvetica")
      .fillColor("#64748b")
      .text("has successfully completed the internship in", 0, currentY, {
        align: "center",
      });
    currentY += 25;

    doc
      .fontSize(20)
      .font("Helvetica-Bold")
      .fillColor("#0f172a")
      .text(certificate.internshipTitle, 0, currentY, { align: "center" });
    currentY += 45;

    // Details Grid
    const detailsY = currentY;
    const labelX = width / 2 - 170;
    const valueX = width / 2 + 10;

    doc
      .fontSize(12)
      .font("Helvetica")
      .fillColor("#64748b")
      .text(`Duration:`, labelX, detailsY, { align: "right", width: 150 })
      .font("Helvetica-Bold").fillColor("#0f172a").text(certificate.duration, valueX, detailsY, { align: "left" });

    const formattedDate = certificate.completionDate
      ? new Date(certificate.completionDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
      : "N/A";

    doc
      .fontSize(12)
      .font("Helvetica")
      .fillColor("#64748b")
      .text(`Completion Date:`, labelX, detailsY + 22, { align: "right", width: 150 })
      .font("Helvetica-Bold").fillColor("#0f172a").text(formattedDate, valueX, detailsY + 22, { align: "left" });

    doc
      .fontSize(12)
      .font("Helvetica")
      .fillColor("#64748b")
      .text(`Certificate ID:`, labelX, detailsY + 44, { align: "right", width: 150 })
      .font("Helvetica-Bold").fillColor("#0f172a").text(certificate.certificateId, valueX, detailsY + 44, { align: "left" });

    // Footer section (Logos, Signatures)
    const footerY = height - 120;

    // MSME & Startup India logos on the left
    const msmeLogoPath = path.join(__dirname, "../templates/msme.png");
    const startupIndiaLogoPath = path.join(__dirname, "../templates/startup-india.png");

    if (fs.existsSync(msmeLogoPath)) {
      doc.image(msmeLogoPath, 60, footerY + 5, { width: 60 });
    }
    if (fs.existsSync(startupIndiaLogoPath)) {
      doc.image(startupIndiaLogoPath, 140, footerY + 5, { width: 70 });
    }

    // Signature Area on the right
    const sigX = width - 300;
    doc.moveTo(sigX, footerY + 25).lineTo(sigX + 240, footerY + 25).lineWidth(1).strokeColor("#94a3b8").stroke();

    doc.fontSize(13).font("Helvetica-Bold").fillColor("#0f172a").text(certificate.signatureName || "Authorized Signature", sigX, footerY + 35, { align: "center", width: 240 });
    doc.fontSize(10).font("Helvetica").fillColor("#64748b").text("For Student Era", sigX, footerY + 52, { align: "center", width: 240 });

    const stampPath = path.join(__dirname, "../templates/stamp.png");
    if (fs.existsSync(stampPath)) {
      doc.opacity(0.4).image(stampPath, sigX + 160, footerY - 25, { width: 70 }).opacity(1);
    }

    doc.end();
    stream.on("finish", () => resolve());
    stream.on("error", reject);
  });
}

module.exports = generateCertificatePDF;
