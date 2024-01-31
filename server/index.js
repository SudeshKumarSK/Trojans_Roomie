import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from 'path';
import { fileURLToPath } from 'url';

import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import spotifyRoutes from "./routes/spotify.routes.js";
import listingsRoutes from "./routes/listings.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;
const CONNECTION_URI = process.env.MONGO_URI;

// Middleware for parsing JSON and urlencoded data and for cookies
app.use(express.json({ limit: '30mb', extended: true }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));
app.use(cookieParser());

// CORS Middleware (adjust according to your needs)
app.use(cors());

// API routes
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/spotify", spotifyRoutes);
app.use("/api/listings", listingsRoutes);

// Connect to MongoDB
mongoose.connect(CONNECTION_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err.message);
    });

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'dist')));

// Handles all requests, routes them to index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({ success: false, message, statusCode });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
