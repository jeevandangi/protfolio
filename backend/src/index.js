import dotenv from 'dotenv';
import { app } from "./app.js";
import { ConnectDb } from "./database/connectDb.js";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 8000;

// Connect to MongoDB and start server
ConnectDb()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
            console.log(`📱 API Base URL: http://localhost:${PORT}/api`);
            console.log(`🏠 Frontend URL: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
        });
    })
    .catch((error) => {
        console.error("❌ MongoDB connection failed:", error);
        process.exit(1);
    });



