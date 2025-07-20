const express = require('express');
const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    updateUserRole,
    getDeletionRequests,
    permanentlyDeleteUser
} = require('../controllers/users');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router
    .route('/')
    .get(protect, authorize('admin', 'co-admin'), getUsers)
    .post(protect, authorize('admin'), createUser);

router
    .route('/:id')
    .get(protect, authorize('admin'), getUser)
    .put(protect, authorize('admin'), updateUser)
    .delete(protect, authorize('admin'), deleteUser);

router.put('/:id/role', protect, authorize('admin'), updateUserRole);
router.get('/deletion-requests', protect, authorize('admin', 'co-admin'), getDeletionRequests);
router.delete('/:id/permanent', protect, authorize('admin', 'co-admin'), permanentlyDeleteUser);

module.exports = router; 