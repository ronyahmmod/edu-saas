import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";

import User from "../models/user.model.js";
import catchAsync from "../utils/catchAsync.js";
import { createAuthSchema } from "../validation/auth.validation.js";

export const register = catchAsync(async (req, res, next) => {
  const parsed = createAuthSchema.safeParse(req.body);
  console.log(parsed.data);
  if (!parsed.success) {
    throw parsed.error;
  }

  const user = await User.create({
    tenant: parsed.data.tenant,
    userName: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    passwordHash: parsed.data.password,
    role: parsed.role,
  });

  res
    .status(StatusCodes.CREATED)
    .json({ message: "User registered", id: user._id });
});
