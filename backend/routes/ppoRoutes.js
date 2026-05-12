const express = require('express');
const router = express.Router();
const {
    issuePPO,
    getAllPPOs,
    getMyPPOs,
    updatePPOStatus,
    deletePPO
} = require('../controllers/ppoController');

const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/my', getMyPPOs);
router.put('/:id/status', updatePPOStatus);

// Admin only routes
router.use(authorize('admin'));
router.post('/issue', issuePPO);
router.get('/', getAllPPOs);
router.delete('/:id', deletePPO);

module.exports = router;
