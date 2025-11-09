const express = require("express");
const {
  getTestimonials,
  getTestimonial,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  uploadAvatar,
} = require("../controllers/testimonials");

const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router
  .route("/")
  .get(getTestimonials)
  .post(protect, authorize("admin"), createTestimonial);

router.route("/upload").post(protect, authorize("admin"), uploadAvatar);

router
  .route("/:id")
  .get(getTestimonial)
  .put(protect, authorize("admin"), updateTestimonial)
  .delete(protect, authorize("admin"), deleteTestimonial);

module.exports = router;
