const express = require('express');
const { generateOfferLetter, getMyOfferLetters, getAllOfferLetters, getOfferLetterById, deleteOfferLetter } = require('../controllers/offerLetters');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

router
    .route('/')
    .post(protect, authorize('admin'), generateOfferLetter)
    .get(protect, authorize('admin'), getAllOfferLetters);

router
    .route('/my-offer-letters')
    .get(protect, getMyOfferLetters);

router
    .route('/:id')
    .get(protect, authorize('admin'), getOfferLetterById)
    .delete(protect, authorize('admin'), deleteOfferLetter);

module.exports = router;