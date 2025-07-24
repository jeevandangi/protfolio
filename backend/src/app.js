import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import apiRoutes from './routes/index.js';

// Load environment variables
dotenv.config({ path: "./.env" });

const app = express();

// CORS configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

// Serve uploaded files
app.use('/uploads', express.static("uploads"));

// Cookie parsing middleware
app.use(cookieParser());

// Trust proxy for accurate IP addresses
app.set('trust proxy', true);

// API Routes
app.use('/api', apiRoutes);

// Root route
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Jeevan Dangi Portfolio API Server',
        version: '1.0.0',
        status: 'Running',
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
        timestamp: new Date().toISOString()
    });
});

// Global error handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    console.error(`Error ${statusCode}: ${message}`);
    console.error(err.stack);

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

export { app };