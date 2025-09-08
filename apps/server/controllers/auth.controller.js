import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { StatusCodes } from "http-status-codes";
import Student from "../models/student.model.js";
import Role from "../models/role.model.js";

import User from "../models/user.model.js";
import catchAsync from "../utils/catchAsync.js";
import { createAuthSchema } from "../validation/auth.validation.js";
import { singToken } from "../utils/jwt.js";
import AppError from "../utils/AppError.js";
import sendMail from "../utils/email.js";
import { otpEmailTemplate } from "../utils/otpEmail.js";

const createAndSendToken = (user, statusCode, res) => {
  const token = singToken(user._id);
  user.password = undefined;
  res.status(statusCode).json({ status: "success", token, data: { user } });
};

export const register = catchAsync(async (req, res, next) => {
  const parsed = createAuthSchema.safeParse(req.body);
  // const userProfile = req.body.userProfile;
  // console.log(req.body.userProfile);
  if (!parsed.success) {
    throw parsed.error;
  }

  // let ProfileModel;
  // switch (parsed.data.role) {
  //   case "student":
  //     ProfileModel = Student;
  //     break;
  //   default:
  //     throw new AppError("Invalid role provided", 400);
  // }

  // 1. Create Role
  // 2. Create Student
  // 3. Create User Link to the Profile

  // const createdRole = await Role.create({ type: parsed.data.role });
  // const createdProfile = await ProfileModel.create(userProfile);

  // Create user linked to the profile
  const newUser = await User.create({
    tenant: parsed.data.tenant,
    phone: parsed.data.phone,
    passwordHash: parsed.data.password,
  });

  // back-reference (optional, if you want profile.user filled)
  // createdProfile.user = newUser._id;
  // await createdProfile.save();

  createAndSendToken(newUser, StatusCodes.CREATED, res);
});

// Register By Role. This function is control the creation of admin, super-admin, principal, teacher
export const registerByRole = (role) => {
  return catchAsync(async (req, res, next) => {
    if (!["admin", "teacher", "super-admin", "principal"].includes(role)) {
      return next(
        new AppError("Invalid role assignment", StatusCodes.NOT_FOUND)
      );
    }
    const { phone, password, tenant } = req.body;
    const newUser = await User.create({
      tenant,
      phone,
      passwordHash: password,
      roles: [role],
    });
    createAndSendToken(newUser, StatusCodes.CREATED, res);
  });
};

export const login = catchAsync(async (req, res, next) => {
  const { phone, password } = req.body;
  if (!phone || !password) {
    return next(
      new AppError(
        "Please provide your mobile number and password",
        StatusCodes.BAD_REQUEST
      )
    );
  }
  const user = await User.findOne({ phone }).select("+passwordHash");
  if (!user || !(await user.verifyPassword(password))) {
    return next(
      new AppError(
        "Incorrect mobile number or password",
        StatusCodes.UNAUTHORIZED
      )
    );
  }
  const token = singToken(user._id);
  res.status(StatusCodes.OK).json({ status: "success", token });
});

export const registerAdmin = registerByRole("admin");
export const registerTeacher = registerByRole("teacher");
export const registerPrincipal = registerByRole("principal");
export const registerSuperAdmin = registerByRole("super-admin");

export const sendPasswordResetOTP = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ phone: req.body.phone });
  if (!user) {
    return next(
      new AppError("No user found with this number", StatusCodes.NOT_FOUND)
    );
  }
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const salt = await bcrypt.genSalt(10);
  const hashOtp = await bcrypt.hash(otp, salt);
  user.otp = hashOtp;
  user.otpExpires = Date.now() + 5 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  await sendMail({
    email: user.email,
    subject: "Your password reset OTP",
    html: otpEmailTemplate(otp),
  });
  res
    .status(StatusCodes.OK)
    .json({ status: "success", message: "OTP sent to email" });
});

export const validateOTP = catchAsync(async (req, res, next) => {
  const { phone, otp } = req.body;
  const user = await User.findOne({ phone: phone });
  if (!user) {
    return next(
      new AppError("No user found with this phone", StatusCodes.NOT_FOUND)
    );
  }
  if (!user || !user.otp) {
    return next(
      new AppError("OTP expired or not set", StatusCodes.BAD_REQUEST)
    );
  }
  const isMatch = await bcrypt.compare(otp, user.otp);
  if (!isMatch) {
    return next(new AppError("Invalid OTP", StatusCodes.NOT_FOUND));
  }

  // Create a temporary reset token
  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // Valid 15 min
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();
  res.status(StatusCodes.OK).json({
    status: "success",
    message: "Use this code within 15 min",
    resetToken,
  });
});

export const resetPassword = catchAsync(async (req, res, next) => {
  const { resetToken, newPassword } = req.body;
  const user = await User.findOne({
    resetPasswordToken: resetToken,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(
      new AppError("Invalid or expired reset token", StatusCodes.NOT_FOUND)
    );
  }
  user.passwordHash = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  res
    .status(StatusCodes.OK)
    .json({ status: "success", message: "Password reset successfully" });
});

export const changePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select("+passwordHash");
  if (!user)
    return next(new AppError("User not found", StatusCodes.BAD_REQUEST));

  const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isMatch)
    return next(
      new AppError("Current password is incorrect", StatusCodes.NOT_FOUND)
    );

  user.passwordHash = newPassword;
  await user.save();

  res
    .status(StatusCodes.OK)
    .json({ status: "success", message: "Password updated successfully" });
});
