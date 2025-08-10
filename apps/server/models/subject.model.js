import mongoose from "mongoose";
import { Schema } from "mongoose";

const subjectSchema = new Schema(
  {
    tenant: {
      type: Schema.Types.ObjectId,
      ref: "College",
      required: true,
    },
    board: {
      type: String,
      enum: ["National", "English Medium", "Madrasha", "Technical", "General"],
      required: true,
    },
    curriculumVersion: { type: String },
    name: { type: String, required: true },
    code: { type: String, required: true },
    shortName: { type: String },
    classLevel: {
      type: String,
      enum: [
        "HSC 1st Year",
        "HSC 2nd Year",
        "Degree 1st Year",
        "Degree 2nd Year",
        "Degree 3rd Year",
        "Honours 1st Year",
        "Honours 2nd Year",
        "Honours 3rd Year",
        "Honours 4th Year",
      ],
    },
    type: {
      type: String,
      enum: ["Compulsory", "Optional", "Elective"],
      required: true,
    },
    // Audit info
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "createdByModel",
    },
    createdByModel: { type: String, enum: ["User", "Teacher", "Admin"] },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Subject", subjectSchema);
