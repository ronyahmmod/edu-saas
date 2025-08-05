import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { connectDB } from "./config/db.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import studentRoutes from "./routes/student.routes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors()); // to maintain CROSS-ORIGIN request response cycle request same origin like localhost:3000
app.use(express.json()); // to get request body object as json style

// Defining routing path
app.use("/api/students", studentRoutes);

// Handle 404 Routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});
// Global error handler (must go after routes)
app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
