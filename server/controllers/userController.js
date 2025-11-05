const User = require('../models/UserModel');

// @desc    Create a new user (by an Admin)
// @route   POST /api/users/create
// @access  Private/Admin
exports.createUserByAdmin = async (req, res) => {
    const { username, email, password, role, department } = req.body;

    // --- NEW PERMISSION CHECK ---
    // 'req.user' is the admin making the request (from the token)
    // 'role' is the role they are TRYING to create

    if (role === 'Admin' && req.user.department !== 'Tech') {
        // If a non-Tech-Admin tries to create an Admin, block them.
        return res.status(403).json({
            message: 'Access Denied: Only Tech Admins can create new Admin accounts.'
        });
    }
    // --- END NEW CHECK ---

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            username,
            email,
            password,
            role,
            department,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                department: user.department,
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update user profile (their own)
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
    // We get 'req.user' from the 'protect' middleware (from the token)
    const user = await User.findById(req.user._id);

    if (user) {
        // Update any fields that were sent in the request
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;

        // IMPORTANT: Only update the password if a new one was sent
        if (req.body.password) {
            user.password = req.body.password;
            // The 'pre-save' hook in your UserModel will automatically hash it!
        }

        const updatedUser = await user.save();

        // Send back the new user info (and a new token)
        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            role: updatedUser.role,
            department: updatedUser.department,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Get all users (by an Admin)
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
    try {
        let users;

        // 'req.user' is the admin making the request (from the token)
        if (req.user.department === 'Tech') {
            // === TECH ADMIN (YOU) ===
            // You are 'Tech', so you get to see everyone.
            users = await User.find({}).select('-password');

        } else {
            // === OTHER ADMINS (Ares, MK) ===
            // They are not 'Tech', so they ONLY see Members in their own department.
            users = await User.find({
                department: req.user.department, // 1. Must be in their department
                role: 'Member'                   // 2. Must have the role 'Member'
            }).select('-password');
        }

        res.json(users);

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        // Find the user to be deleted
        const targetUser = await User.findById(req.params.id);

        if (!targetUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (targetUser.title === 'CEO') {
            return res.status(403).json({
                message: 'Action Forbidden: The CEO account cannot be deleted.'
            });
        }

        // --- PERMISSION CHECK ---
        const adminUser = req.user; // This is the admin making the request

        if (adminUser.department !== 'Tech') {
            // If the admin is NOT Tech (e.g., Content Admin)

            if (targetUser.role === 'Admin') {
                // 1. Block attempt to delete ANY Admin
                return res.status(403).json({ message: 'You cannot delete Admin accounts.' });
            }
            if (targetUser.department !== adminUser.department) {
                // 2. Block attempt to delete a Member from another department
                return res.status(403).json({ message: 'You can only delete members of your own department.' });
            }
        }

        // --- Tech Admin (You) OR a permitted Admin ---
        // If we get here, the deletion is allowed.

        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User removed successfully.' });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};