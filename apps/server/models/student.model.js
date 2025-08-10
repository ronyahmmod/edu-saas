import mongoose from "mongoose";
import { Schema } from "mongoose";

// Document sub-schema
const documentSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
    },
    url: { type: String, required: true },
    verified: { type: Boolean, default: false },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

// Student schema
const studentSchema = new Schema({
  tenant: { type: Schema.Types.ObjectId, ref: "College", required: true },

  studentId: { type: String, required: true, unique: true },

  name: {
    first: { type: String, required: true },
    last: { type: String },
    full: { type: String },
  },

  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  dateOfBirth: { type: Date, required: true },
  bloodGroup: {
    type: String,
    enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
  },
  religion: {
    type: String,
    enum: ["Islam", "Hinduism", "Christianity", "Buddhism", "Others"],
  },
  nationality: { type: String, default: "Bangladeshi" },

  nid: { type: String, minlength: 10 },
  birthRegNo: { type: String, minlength: 10 },
  passportNo: { type: String },

  contact: {
    phone: { type: String, required: true },
    email: { type: String },
  },

  address: {
    present: {
      village: { type: Schema.Types.ObjectId, ref: "Village" },
      postOffice: { type: Schema.Types.ObjectId, ref: "PostOffice" },
      union: { type: Schema.Types.ObjectId, ref: "Union" },
      pouroshova: { type: Schema.Types.ObjectId, ref: "Pouroshova" },
      wordNo: { type: Number },
    },
    permanent: {
      village: { type: Schema.Types.ObjectId, ref: "Village" },
      postOffice: { type: Schema.Types.ObjectId, ref: "PostOffice" },
      union: { type: Schema.Types.ObjectId, ref: "Union" },
      pouroshova: { type: Schema.Types.ObjectId, ref: "Pouroshova" },
      wordNo: { type: Number },
    },
  },

  guardian: {
    fatherName: { type: String, required: true },
    motherName: { type: String, required: true },
    guardianName: { type: String },
    relation: { type: String, default: "Father" },
    phone: { type: String, required: true },
    occupation: { type: String },
    monthlyIncome: { type: Number },
  },

  academic: {
    session: { type: String, required: true },
    class: { type: String, enum: ["XI", "XII"], required: true },
    shift: { type: String, enum: ["Morning", "Day"], required: true },
    version: { type: String, enum: ["Bangla", "English"], required: true },
    board: { type: String, required: true },
    group: {
      type: String,
      enum: ["Science", "Commerce", "Humanities"],
      required: true,
    },
    roll: { type: String, required: true },
    registrationNo: { type: String },
    departmentId: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    approvedSubjects: [{ type: Schema.Types.ObjectId, ref: "Subject" }],
    sscInfo: {
      roll: { type: String, required: true },
      reg: { type: String, required: true },
      board: { type: String, required: true },
      gpa: { type: Number, min: 0, max: 5, required: true },
      year: { type: Number, required: true },
      institute: { type: String },
    },
  },

  documents: [documentSchema],

  status: {
    isActive: { type: Boolean, default: true },
    isApproved: { type: Boolean, default: false },
    approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
    approvedAt: { type: Date },
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Custom validation: Require either NID or BRN
studentSchema.pre("validate", function (next) {
  if (!this.nid && !this.birthRegNo) {
    return next(
      new Error("Either NID or Birth Registration Number is required.")
    );
  }
  next();
});

export default mongoose.model("Student", studentSchema);
