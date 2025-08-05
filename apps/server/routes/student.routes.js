import express from "express";
import { createStudent } from "../controllers/student.controller.js";
import { upload } from "../libs/multer.js";
import catchAsync from "../utils/catchAsync.js";
import Student from "../models/student.model.js";

// Accessing Router for accessing request object like file
// Multer also a middleware who is handle the file request
// I use Cloudinary to store the submitted file

// file send by request --> handled by multer --> file save to the cloudinary --> mongodb store the cloudinary public url with this file

const router = express.Router();

// Handle the post request coming from /api/students/

router.post(
  "/",
  upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "documents", maxCount: 5 },
  ]),
  createStudent
);

router.get(
  "/",
  catchAsync(async (req, res) => {
    const students = await Student.find().sort({ createdAt: -1 });
    if (!students) {
      throw new AppError("Student not founded", 404);
    }
    res.json(students);
  })
);

export default router;
