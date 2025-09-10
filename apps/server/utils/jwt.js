import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

export const singToken = (user, res) => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );
  return token;
};
