// server/routes/authRoutes.js

const express = require('express');
const router = express.Router();

// Import the controller logic
const { registerUser, LoginUser, loginUser } = require('../controllers/authController');

// --- Define the Routes ---

// When a POST request hits '/api/auth/register', run the registerUser function 
router.post('/register', registerUser);

// When a POST request htis '/api/auth/login', run the loginUser function
router.post('/login', loginUser);

module.exports = router;