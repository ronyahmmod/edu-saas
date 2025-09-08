import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import User from "../models/user.model.js";
import { StatusCodes } from "http-status-codes";

export const protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // request take the token as Bearer [token]
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new AppError("You are not logged in", StatusCodes.UNAUTHORIZED)
    );
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) return next(new AppError("User no longer exists", 401));
  req.user = currentUser;
  next();
});

// Restrict by Roles
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user.roles.some((role) => roles.includes(role))) {
      return next(
        new AppError("You do not have permission", StatusCodes.FORBIDDEN)
      );
    }
    next();
  };
};

// Restrict by permissions
export const requirePermission = (...permissions) => {
  return (req, res, next) => {
    if (
      req.user.roles.some((role) =>
        ["admin", "super-admin", "principal"].includes(role)
      )
    ) {
      return next();
    }
    if (
      !req.user.permissions.some((permission) =>
        permissions.includes(permission)
      )
    ) {
      return next(new AppError("Permission denied", StatusCodes.FORBIDDEN));
    }
    next();
  };
};
