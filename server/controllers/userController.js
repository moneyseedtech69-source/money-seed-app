const User = require('../models/UserModel');

// @desc    Create a new user (by an Admin)
// @route   POST /api/users/create
// @access  Private/Admin
exports.createUserByAdmin = async (req, res) => {
    // Get the admin who is making the request
    const requestingAdmin = req.user;

    // Get the details for the new user
    let { username, email, password, role, department } = req.body;

    // --- PERMISSION CHECK ---
    if (requestingAdmin.title !== 'Technical Co-Founder') {
        // If you are a Standard Admin...

        // 1. You cannot create other Admins
        if (role === 'Admin') {
            return res.status(403).json({ message: 'Only the Technical Co-Founder can create new Admin accounts.' });
        }

        // 2. You can only create users in your own department
        department = requestingAdmin.department; // Force department
    }
    // If you ARE the Technical Co-Founder, these checks are skipped.

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create the user with the (potentially) modified department
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
                title: user.title,
                profilePictureUrl: user.profilePictureUrl
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
        const groupedUsers = {}; // Start with an empty object, e.g., { Tech: [], Content: [] }

        // 'req.user' is the admin making the request (from the token)
        if (req.user.title === 'Technical Co-Founder') {
            // === You are Super Admin ===
            // You get to see everyone.
            users = await User.find({}).select('-password');

            // Group all users by their department
            users.forEach(user => {
                const dept = user.department;
                if (!groupedUsers[dept]) {
                    groupedUsers[dept] = []; // Create the array if it doesn't exist
                }
                groupedUsers[dept].push(user);
            });

        } else {
            // === You are a Standard Admin ===
            // You ONLY see Members in your own department.
            users = await User.find({
                department: req.user.department,
                role: 'Member'
            }).select('-password');

            // Only add their *own* department to the object
            groupedUsers[req.user.department] = users;
        }

        res.json(groupedUsers); // Send the grouped object

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete a user (by an Admin)
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
    try {
        const targetUser = await User.findById(req.params.id);

        if (!targetUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // --- BULLETPROOF CHECK ---
        if (targetUser.title === 'Technical Co-Founder') {
            return res.status(403).json({ message: 'Action Forbidden: The Technical Co-Founder account cannot be deleted.' });
        }

        // --- PERMISSION CHECK ---
        const requestingAdmin = req.user;
        if (requestingAdmin.title !== 'Technical Co-Founder') {
            // If you are a Standard Admin...

            // 1. You cannot delete other Admins
            if (targetUser.role === 'Admin') {
                return res.status(403).json({ message: 'You are not authorized to delete other Admins.' });
            }

            // 2. You cannot delete users from other departments
            if (targetUser.department !== requestingAdmin.department) {
                return res.status(403).json({ message: 'You can only delete members in your own department.' });
            }
        }

        // If you pass all checks (or are the Tech Co-Founder), you can delete.
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User removed successfully.' });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};