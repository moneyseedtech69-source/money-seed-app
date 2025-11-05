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
// Allows client and server to talk
const corsOptions = {
    origin: 'https://musical-daifuku-523502.netlify.app' // Your live Netlify URL
};
app.use(cors(corsOptions));
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