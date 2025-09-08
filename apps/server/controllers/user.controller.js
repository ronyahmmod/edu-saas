import User from "../models/user.model.js";
import { restFactory } from "../utils/restFactory.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import { StatusCodes } from "http-status-codes";

export const updatePermissions = catchAsync(async (req, restFactory, next) => {
  const { permissions } = req.body; // like ['canDeleteUser', 'cenViewReport']
  if (!Array.isArray(permissions)) {
    return next(
      new AppError("Permissions must be an Array", StatusCodes.BAD_REQUEST)
    );
  }
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { permissions },
    { new: true, runValidators: true }
  );
  if (!user) {
    return next(
      new AppError("No user found with the ID.", StatusCodes.NOT_FOUND)
    );
  }
  rest.status(StatusCodes.OK).json({ status: "success", data: { user } });
});

export const addPermission = catchAsync(async (req, res, next) => {
  const { permission } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { permissions: permission } },
    { new: true }
  );
  if (!user)
    return next(
      new AppError("User not found with this ID", StatusCodes.NOT_FOUND)
    );
  res.status(StatusCodes.OK).json({ status: "success", data: { user } });
});

export const removePermission = catchAsync(async (req, res, next) => {
  const { permission } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      $pull: { permissions: permission },
    },
    { new: true }
  );
  if (!user) {
    return next(
      new AppError("User not found with this ID", StatusCodes.NOT_FOUND)
    );
  }
  res.status(StatusCodes.OK).json({ status: "success", data: { user } });
});

export default {
  ...restFactory(User),
  removePermission,
  addPermission,
  updatePermissions,
};
