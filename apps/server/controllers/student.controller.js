import catchAsync from "../utils/catchAsync.js";
import { createStudentSchema } from "../validation/student.validation.js";
import Student from "../models/student.model.js";
import {
  uploadCloudinary,
  uploadCloudinaryWithFileName,
} from "../libs/cloudinary.js";

// This is for many files upload
export const createStudent = catchAsync(async (req, res, next) => {
  const parsed = createStudentSchema.safeParse(req.body);
  if (!parsed.success) {
    // Zod will throw a 'ZodError'
    throw parsed.error;
  }

  const uploadedFiles = {
    profilePicUrl: null,
    documents: [],
  };

  // Upload files
  const profile = req.files["profilePic"]?.[0];
  if (profile) {
    const filename = `${parsed.data.group}_${parsed.data.classRoll}`;
    const result = await uploadCloudinaryWithFileName(
      profile.buffer,
      `students/hsc/${parsed.data.session.split("-").join("_")}/${parsed.data.group}/${parsed.data.classRoll}`,
      filename,
      profile.mimetype
    );
    uploadedFiles.profilePicUrl = result.secure_url;
  }

  // Upload Each Documents
  const docs = req.files["documents"] || [];
  for (let i = 0; i < docs.length; i++) {
    const doc = docs[i];
    const result = await uploadCloudinary(
      doc.buffer,
      `students/hsc/${parsed.data.session.split("-").join("_")}/${parsed.data.group}/${parsed.data.classRoll}/documents`,
      doc.mimetype
    );
    uploadedFiles.documents.push({
      url: result.secure_url,
      name: result.original_filename,
      format: result.format,
    });
  }

  // Save to MongoDB
  const student = await Student.create({
    ...parsed.data,
    profilePic: uploadedFiles.profilePicUrl,
    documents: uploadedFiles.documents,
  });

  res.status(201).json({
    success: true,
    message: "Admission data successfully send to the server",
    student,
  });
});

// This is for single file upload.

//----------------------------------------------------------------------
// export const createStudent = catchAsync(async (req, res, next) => {
//   const parsed = createStudentSchema.safeParse(req.body);
//   if (!parsed.success) {
//     // Zod will throw a 'ZodError'
//     throw parsed.error;
//   }
//   let photoUrl = "";
//   if (req.file) {
//     const result = await uploadCloudinary(
//       req.file.buffer,
//       `students/hsc/${parsed.body.session.split("-").join("_")}`,
//       req.file.mimetype
//     );
//     photoUrl = result.secure_url;
//   }

//   const student = await Student.create({
//     ...parsed.data,
//     profilePic: photoUrl,
//   });
//   res.status(201).json({ success: true, data: student });
// });
