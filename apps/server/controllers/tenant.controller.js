import College from "../models/college.model.js";
import { createTenantSchema } from "../validation/tenant.validation.js";
import { restFactory } from "../utils/restFactory.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import { uploadCloudinary } from "../libs/cloudinary.js";
import { StatusCodes } from "http-status-codes";
import cloudinary from "../config/cloudinary.js";

const factory = restFactory(College, createTenantSchema);

export const uploadTenantLogo = catchAsync(async (req, res, next) => {
  console.log(req.body);
  if (!req.file) {
    return next(new AppError("No file uploaded", 400));
  }

  const result = await uploadCloudinary(
    req.file.buffer,
    "tenants/logos",
    req.file.mimetype
  );

  // Save to DB
  const tenant = await College.findByIdAndUpdate(
    req.params.id,
    {
      logo: {
        url: result.secure_url,
        publicId: result.public_id,
      },
    },
    { new: true }
  );

  res.status(StatusCodes.OK).json({ success: true, data: tenant });
});

// Update tenant logo
export const updateTenantLogo = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError("No file uploaded", StatusCodes.BAD_REQUEST));
  }
  // Find tenant
  const tenant = await College.findById(req.params.id);
  if (!tenant) {
    return next(new AppError("Tenant not found", StatusCodes.NOT_FOUND));
  }

  // Delete old logo of exists
  if (tenant.logo?.publicId) {
    await cloudinary.uploader.destroy(tenant.logo.publicId);
  }

  // upload new logo
  const result = await uploadCloudinary(
    req.file.buffer,
    "tenants/logos",
    req.file.mimetype
  );

  // Update tenant record
  tenant.logo = {
    url: result.secure_url,
    publicId: result.public_id,
  };
  await tenant.save();
  res.status(StatusCodes.OK).json({ success: true, data: tenant });
});

export default { ...factory, uploadTenantLogo, updateTenantLogo };
