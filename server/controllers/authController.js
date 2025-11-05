// server/controllers/authController.js

const User = require('../models/UserModel'); // Imports your User model
const jwt = require('jsonwebtoken'); // Imports the token generator

// --- Helper function to create a token ---
const generateToken = (id) => {
    // Uses your JWT_SECRET from the .env file
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // The token will last for 30 days
    });
};

// --- 1. Register a New User ---
exports.registerUser = async (req, res) => {
    // Get the data the user sent (from their form)
    const { username, email, password, role, department } = req.body;

    try {
        // Check if a user with this email already exists in the database
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // If not, create a new user in the database
        // (The password will be automatically hashed by the 'pre save' hook in my model)
        const user = await User.create({
            username,
            email,
            password,
            role: role,
            department: department
        });

        // If the user was created successfully...
        if (user) {
            // Send back a success message and a login token
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                department: user.department,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// --- 2. Login an Existing User ---
exports.loginUser = async (req, res) => {
    // --- CHANGED 'email' to 'username' ---
    const { username, password } = req.body;

    try {
        // --- CHANGED findOne({ email }) to findOne({ username }) ---
        const user = await User.findOne({ username });

        // If user exists AND the password matches...
        if (user && (await user.matchPassword(password))) {
            // Send back their info and a new login token
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                profilePictureUrl: user.profilePictureUrl,
                department: user.department,
                token: generateToken(user._id),
            });
        } else {
            // --- CHANGED error message ---
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};