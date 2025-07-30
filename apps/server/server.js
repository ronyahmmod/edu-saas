import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { connectDB } from "./config/db.js";
import studentRoutes from "./routes/student.routes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors()); // to maintain CROSS-ORIGIN request response cycle request same origin like localhost:3000
app.use(express.json()); // to get request body object as json style

// Defining routing path
app.use("/api/students", studentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
