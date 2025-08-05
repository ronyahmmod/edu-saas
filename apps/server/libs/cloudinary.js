import cloudinary from "../config/cloudinary.js";

export const uploadCloudinary = async (fileBuffer, folder, mimetype) => {
  let resourceType = "image";
  if (mimetype === "application/pdf") {
    resourceType = "raw";
  } else if (mimetype.startsWith("video/")) {
    resourceType = "video";
  }
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { resource_type: resourceType, folder },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      )
      .end(fileBuffer);
  });
};

export const uploadCloudinaryWithFileName = async (
  fileBuffer,
  folder,
  filename,
  mimetype
) => {
  let resourceType = "image";
  if (mimetype === "application/pdf") {
    resourceType = "raw";
  } else if (mimetype.startsWith("video/")) {
    resourceType = "video";
  }
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: resourceType,
          folder,
          public_id: filename,
          unique_filename: false,
          overwrite: true,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      )
      .end(fileBuffer);
  });
};
