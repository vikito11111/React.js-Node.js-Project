const express = require('express');
const router = express.Router();

const {
    getProfile,
    updateProfile,
    changePassword,
    getPublicProfile,
    deleteAccount,
    getAllUsers,
    updateUserRole,
    updateUserStatus
} = require('../controllers/userController');

const { protect, autorize, authorize } = require('../middleware/auth');

// (Logged-in Users)
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.delete('/profile', protect, deleteAccount);

// (Admin only)
router.get('/', protect, authorize('admin'), getAllUsers);
router.put('/:id/role', protect, authorize('admin'), updateUserRole);
router.put('/:id/status', protect, authorize('admin'), updateUserStatus);

router.get('/:username', getPublicProfile);

module.exports = router;