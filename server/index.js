// server/index.js

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables (for database password, etc.)
dotenv.config({ path: './config/.env' });

// --- Connect to Database ---
connectDB();

const app = express();

// --- Middleware ---

// Whitelist for your Netlify site
const whitelist = ['https.netlify.app']; // Trusts all Netlify app subdomains

const corsOptions = {
    origin: (origin, callback) => {
        // Check if the origin (the URL of the frontend) ends with .netlify.app
        // !origin allows requests from tools like Postman/Thunder Client (which have no origin)
        if (!origin || whitelist.some(url => origin.endsWith(url))) {
            callback(null, true); // Allow the request
        } else {
            callback(new Error('Not allowed by CORS')); // Block the request
        }
    }
};
app.use(cors(corsOptions)); // Use the new, smarter CORS options

// Allows server to read JSON from requests
app.use(express.json());

// --- API Routes ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// --- Start Server ---
const PORT = process.env.PORT || 5000; // Use port 5000 for backend
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});