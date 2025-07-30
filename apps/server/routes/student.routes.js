import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import Student from "../models/student.model.js";

// Accessing Router for accessing request object like file
// Multer also a middleware who is handle the file request
// I use Cloudinary to store the submitted file

// file send by request --> handled by multer --> file save to the cloudinary --> mongodb store the cloudinary public url with this file

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1024 * 1024 }, // 1mb
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only JPEG and PNG images are allowed. File also less than 1MB"
        )
      );
    }
  },
});

// Handle the post request coming from /api/students/

router.post(
  "/",
  upload.single("profilePic"),
  (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      res.status(400).json({ success: false, message: err.message });
    } else if (err) {
      res.status(400).json({ success: false, message: err.message });
    }
    next();
  },
  async (req, res) => {
    try {
      const { name, email, phone } = req.body;
      let profilePicUrl = "";
      if (req.file) {
        // Wrap Cloudinary upload in a Promise
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: "image", folder: "student_profiles" },
            (error, result) => {
              if (error) reject(error);
              resolve(result);
            }
          );
          stream.end(req.file.buffer);
        });
        profilePicUrl = result.secure_url;
      }
      const student = new Student({
        name,
        email,
        phone,
        profilePic: profilePicUrl,
      });
      const saved = await student.save();
      return res.status(201).json({ success: true, data: saved });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
);

router.get("/", async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(5000).json({ success: false, message: err.message });
  }
});

export default router;
