const express = require("express");
const {
  generateOfferLetter,
  getMyOfferLetters,
  getAllOfferLetters,
  getOfferLetterById,
  updateOfferLetter,
  deleteOfferLetter,
  sendOfferLetterByAdmin,
} = require("../controllers/offerLetters");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");

// Admin: Send offer letter by user ID/name/domain/email
router.post(
  "/admin/send-offer-letter",
  protect,
  authorize("admin"),
  sendOfferLetterByAdmin,
);

router
  .route("/")
  .post(protect, authorize("admin"), generateOfferLetter)
  .get(protect, authorize("admin"), getAllOfferLetters);

router.route("/my-offer-letters").get(protect, getMyOfferLetters);

router
  .route("/:id")
  .get(protect, authorize("admin"), getOfferLetterById)
  .put(protect, authorize("admin"), updateOfferLetter)
  .delete(protect, authorize("admin"), deleteOfferLetter);

module.exports = router;
