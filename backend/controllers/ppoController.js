const PPO = require("../models/PPO");
const User = require("../models/User");
const generatePPOLetterPDF = require("../utils/generatePPOLetterPDF");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const sendEmail = require("../utils/sendEmail");
const createNotification = require("../utils/createNotification");

// @desc    Admin: Issue a Pre-Placement Offer (PPO)
// @route   POST /api/ppo/issue
// @access  Private/Admin
exports.issuePPO = async (req, res) => {
  try {
    const {
      userId,
      jobTitle,
      department,
      ctc,
      joiningDate,
      workLocation,
      probationPeriod,
      hrName,
      referenceNo
    } = req.body;

    // Find user by ID or internId
    let userDoc;
    if (mongoose.Types.ObjectId.isValid(userId)) {
      userDoc = await User.findById(userId);
    } else {
      userDoc = await User.findOne({ internId: userId });
    }

    if (!userDoc) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Use the actual Mongo _id from the userDoc
    const actualUserId = userDoc._id;

    // Check if PPO already exists for this job title
    const existing = await PPO.findOne({ user: actualUserId, jobTitle });
    if (existing) {
      return res.status(400).json({ success: false, message: "PPO already issued for this role" });
    }

    const ppoData = {
      user: actualUserId,
      candidateName: userDoc.name,
      internId: userDoc.internId,
      jobTitle,
      department,
      ctc,
      joiningDate,
      workLocation,
      probationPeriod,
      hrName,
      referenceNo: referenceNo || `SE/PPO/${userDoc.internId}/${Date.now().toString().slice(-4)}`,
      issueDate: new Date()
    };

    const ppo = new PPO(ppoData);

    // Generate PDF
    const pdfDir = path.join(__dirname, "../uploads/ppo");
    if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir, { recursive: true });
    const pdfPath = path.join(pdfDir, `${ppo._id}.pdf`);
    
    await generatePPOLetterPDF(ppoData, pdfPath);

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(pdfPath, {
      folder: "ppo",
      resource_type: "raw",
      public_id: `${ppo._id}.pdf`,
      type: "upload",
      access_mode: "public"
    });

    ppo.fileUrl = result.secure_url;
    await ppo.save();

    // Send email
    try {
      if (userDoc.email) {
        await sendEmail({
          email: userDoc.email,
          from: "noreply@studentera.online",
          subject: `Congratulations! Pre-Placement Offer (PPO) from Student Era`,
          message: `Dear ${userDoc.name},\n\nWe are delighted to offer you a full-time position as ${jobTitle} at Student Era. Please find your Pre-Placement Offer letter attached/linked below.\n\nLink: ${result.secure_url}\n\nBest Regards,\nHR Team`,
          html: `<h3>Congratulations ${userDoc.name}!</h3><p>We are delighted to offer you a full-time position as <b>${jobTitle}</b> at Student Era.</p><p>Please find your Pre-Placement Offer letter at the link below:</p><p><a href="${result.secure_url}" style="padding: 10px 20px; background: #0A2463; color: white; text-decoration: none; border-radius: 5px;">View PPO Letter</a></p><p>Best Regards,<br>HR Team</p>`
        });
      }
    } catch (emailErr) {
      console.error("PPO Email Error:", emailErr);
    }

    // Create notification
    await createNotification(
      actualUserId,
      `Congratulations! You have received a Pre-Placement Offer (PPO) for the position of "${jobTitle}". Check your dashboard to view details.`
    );

    // Clean up
    fs.unlinkSync(pdfPath);

    res.status(201).json({ success: true, data: ppo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get all PPOs (Admin)
// @route   GET /api/ppo
// @access  Private/Admin
exports.getAllPPOs = async (req, res) => {
  try {
    const ppos = await PPO.find().populate("user", "name email internId").sort("-createdAt");
    res.status(200).json({ success: true, count: ppos.length, data: ppos });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Get my PPOs (Student)
// @route   GET /api/ppo/my
// @access  Private
exports.getMyPPOs = async (req, res) => {
  try {
    const ppos = await PPO.find({ user: req.user.id }).sort("-createdAt");
    res.status(200).json({ success: true, count: ppos.length, data: ppos });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Update PPO Status (Accept/Reject)
// @route   PUT /api/ppo/:id/status
// @access  Private
exports.updatePPOStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Accepted', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const ppo = await PPO.findById(req.params.id);
    if (!ppo) {
      return res.status(404).json({ success: false, message: "PPO not found" });
    }

    // Only user can update their own PPO status
    if (ppo.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    ppo.status = status;
    await ppo.save();

    // Notify Admin? (Optional)
    
    res.status(200).json({ success: true, data: ppo });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Delete PPO
// @route   DELETE /api/ppo/:id
// @access  Private/Admin
exports.deletePPO = async (req, res) => {
  try {
    const ppo = await PPO.findById(req.params.id);

    if (!ppo) {
      return res.status(404).json({ success: false, message: "PPO not found" });
    }

    await ppo.deleteOne();
    res.status(200).json({ success: true, message: "PPO deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
