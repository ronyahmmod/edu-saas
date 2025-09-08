import express from "express";
import {
  changePassword,
  login,
  register,
  registerAdmin,
  registerPrincipal,
  registerSuperAdmin,
  registerTeacher,
  resetPassword,
  sendPasswordResetOTP,
  validateOTP,
} from "../controllers/auth.controller.js";
import { protect, restrictTo } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/register", register);
router.post("/forgot-password", sendPasswordResetOTP);
router.post("/validate-otp", validateOTP);
router.post("/reset-password", resetPassword);
router.post("/register/super-admin", registerSuperAdmin);
router.post(
  "/register/admin",
  protect,
  restrictTo("super-admin"),
  registerAdmin
);
router.post(
  "/register/principal",
  protect,
  restrictTo("admin", "super-admin"),
  registerPrincipal
);
router.post(
  "/register/teacher",
  protect,
  restrictTo("admin", "super-admin", "principal"),
  registerTeacher
);

router.post("/change-password", protect, changePassword);

router.post("/login", login);
export default router;
