// server/index.js

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config({ path: './config/.env' });

// --- Connect to Database ---
connectDB();

const app = express();

// --- Middleware ---

// This is the new, bulletproof CORS setting.
// It uses a Regular Expression (Regex) to trust *ANY* subdomain
// that ends with "netlify.app". This will work.
const corsOptions = {
    origin: [/\.netlify\.app$/, 'http://localhost:3000'] // Allows Netlify and your local machine
};
app.use(cors(corsOptions));

// This is required for preflight requests to work
app.options('*', cors(corsOptions));

// Allows server to read JSON from requests
app.use(express.json());

// --- API Routes ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});