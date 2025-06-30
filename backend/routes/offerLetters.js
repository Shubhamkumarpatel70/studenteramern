const express = require('express');
const {
    generateOfferLetter,
    getMyOfferLetters,
    getAllOfferLetters,
    getOfferLetterById,
    deleteOfferLetter
} = require('../controllers/offerLetters');

console.log('generateOfferLetter:', typeof generateOfferLetter);
console.log('getMyOfferLetters:', typeof getMyOfferLetters);
console.log('getAllOfferLetters:', typeof getAllOfferLetters);
console.log('getOfferLetterById:', typeof getOfferLetterById);
console.log('deleteOfferLetter:', typeof deleteOfferLetter);

const router = express.Router();
const protect = require('../middleware/auth');
const authorize = require('../middleware/auth').authorize;

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