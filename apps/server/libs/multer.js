import multer from "multer";
import AppError from "../utils/AppError.js";

const ALLOWED_FORMATS = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "application/pdf",
  "video/mp4",
];
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (ALLOWED_FORMATS.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError("Only JPG, PNG, PDF, and MP4 files are allowed", 400));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB limit to allow short videos
  },
});
