// server/routes/userRoutes.js
const express = require('express');
const router = express.Router();

// --- 1. IMPORT THE NEW FUNCTION ---
const { createUserByAdmin, updateUserProfile, getAllUsers, deleteUser } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');
const { route } = require('./authRoutes');

// GET /api/users (Get all users, Admin only)
router.get('/', protect, admin, getAllUsers);

// POST /api/users/create (Create user, Admin only)
router.post('/create', protect, admin, createUserByAdmin);

// PUT /api/users/profile (Update self, any logged-in user)
router.put('/profile', protect, updateUserProfile);

router.delete('/:id', protect, admin, deleteUser);

module.exports = router;