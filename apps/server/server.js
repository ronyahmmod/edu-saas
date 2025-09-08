import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { connectDB } from "./config/db.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";

import studentRoutes from "./routes/student.routes.js";
import authRoutes from "./routes/auth.routes.js";
import tenantRouts from "./routes/tenant.routes.js";
import addressRoutes from "./routes/address.routes.js";
import userRoutes from "./routes/user.routes.js";

import ntpTimestamp from "./middlewares/ntpTimestamp.js";
import { StatusCodes } from "http-status-codes";

dotenv.config();
connectDB();

const app = express();
app.use(cors()); // to maintain CROSS-ORIGIN request response cycle request same origin like localhost:3000
app.use(express.json()); // to get request body object as json style

// Use NTPTimestamp for all routes
app.use(ntpTimestamp);

// Defining routing path
app.use("/api/students", studentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/tenants", tenantRouts);
app.use("/api/addresses", addressRoutes);
app.use("/api/users", userRoutes);
app.use("/", (req, res) => {
  res
    .status(StatusCodes.OK)
    .json(
      "Welcome to edu-sass system. It will manage your institution easily."
    );
});
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
