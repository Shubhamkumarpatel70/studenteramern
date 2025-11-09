const Testimonial = require("../models/Testimonial");
const cloudinary = require("../config/cloudinary");
const multer = require("multer");
const path = require("path");

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
}).single("avatar");

// @desc    Get all testimonials
// @route   GET /api/testimonials
// @access  Public
exports.getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isActive: true }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Get single testimonial
// @route   GET /api/testimonials/:id
// @access  Public
exports.getTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    res.status(200).json({
      success: true,
      data: testimonial,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Create new testimonial
// @route   POST /api/testimonials
// @access  Private (Admin only)
exports.createTestimonial = async (req, res) => {
  try {
    let imageUrl = req.body.image;

    // If no image provided, use default avatar
    if (!imageUrl) {
      imageUrl = "https://i.pravatar.cc/150";
    }

    const testimonialData = {
      ...req.body,
      image: imageUrl,
    };

    const testimonial = await Testimonial.create(testimonialData);

    res.status(201).json({
      success: true,
      data: testimonial,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Upload avatar for testimonial
// @route   POST /api/testimonials/upload
// @access  Private (Admin only)
exports.uploadAvatar = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    try {
      // Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "testimonials",
            public_id: `testimonial_${Date.now()}`,
            transformation: [{ width: 150, height: 150, crop: "fill" }],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      res.status(200).json({
        success: true,
        data: {
          imageUrl: result.secure_url,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Upload failed",
      });
    }
  });
};

// @desc    Update testimonial
// @route   PUT /api/testimonials/:id
// @access  Private (Admin only)
exports.updateTestimonial = async (req, res) => {
  try {
    let updateData = { ...req.body };

    // If no image provided in update, use default avatar
    if (!updateData.image) {
      updateData.image = "https://i.pravatar.cc/150";
    }

    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    res.status(200).json({
      success: true,
      data: testimonial,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Delete testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private (Admin only)
exports.deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    await testimonial.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
