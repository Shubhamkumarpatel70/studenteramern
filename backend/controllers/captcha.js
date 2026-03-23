const Captcha = require("../models/Captcha");
const svgCaptcha = require("svg-captcha");

// Generate SVG CAPTCHA (4 characters, numbers and uppercase letters)
const generateCaptcha = () => {
  return svgCaptcha.create({
    size: 4,
    noise: 2,
    color: true,
    background: "#f8f9fa",
    width: 120,
    height: 48,
    fontSize: 48,
    charPreset: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  });
};

// @desc    Generate a new CAPTCHA (SVG)
// @route   GET /api/captcha/generate
// @access  Public
exports.generateCaptcha = async (req, res, next) => {
  try {
    // Delete old unused CAPTCHAs
    await Captcha.deleteMany({ used: true });
    await Captcha.deleteMany({ expiresAt: { $lt: new Date() } });

    // Generate new SVG CAPTCHA
    const captchaObj = generateCaptcha();
    const code = captchaObj.text;
    const svg = captchaObj.data;
    const captcha = await Captcha.create({
      code,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    res.status(200).json({
      success: true,
      data: {
        captchaId: captcha._id,
        svg: svg, // Send SVG string to frontend for display
      },
    });
  } catch (err) {
    console.error("CAPTCHA generation error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to generate CAPTCHA",
    });
  }
};

// @desc    Verify CAPTCHA
// @route   POST /api/captcha/verify
// @access  Public
exports.verifyCaptcha = async (req, res, next) => {
  try {
    const { captchaId, code } = req.body;

    if (!captchaId || !code) {
      return res.status(400).json({
        success: false,
        message: "Please provide CAPTCHA ID and code",
      });
    }

    // Find CAPTCHA
    const captcha = await Captcha.findById(captchaId);

    if (!captcha) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired CAPTCHA",
      });
    }

    // Check if already used
    if (captcha.used) {
      return res.status(400).json({
        success: false,
        message: "CAPTCHA has already been used",
      });
    }

    // Check if expired
    if (captcha.expiresAt < new Date()) {
      await captcha.deleteOne();
      return res.status(400).json({
        success: false,
        message: "CAPTCHA has expired",
      });
    }

    // Verify code (case-insensitive)
    const isValid = captcha.code.toUpperCase() === code.toUpperCase().trim();

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid CAPTCHA code",
      });
    }

    // Mark as used
    captcha.used = true;
    await captcha.save();

    res.status(200).json({
      success: true,
      message: "CAPTCHA verified successfully",
    });
  } catch (err) {
    console.error("CAPTCHA verification error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to verify CAPTCHA",
    });
  }
};
