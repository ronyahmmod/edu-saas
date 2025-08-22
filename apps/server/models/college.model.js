import mongoose from "mongoose";
import { Schema } from "mongoose";

const collegeSchema = new Schema({
  name: { type: String, required: true, trim: true },
  eiin: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  organizationId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, trim: true },
  phone: { type: String, required: true, unique: true, trim: true },
  website: { type: String },
  logo: { url: { type: String }, publicId: { type: String } },
  address: {
    village: String,
    postOffice: String,
    upazila: String,
    district: String,
    division: String,
    postalCode: String,
  },
  establishedYear: Number,
  institutionType: {
    type: String,
    enum: ["Private", "Government", "Semi-Govt"],
    default: "Private",
  },
  principal: { name: String, phone: String, email: String },
  approvedGroups: [String],
  approvedSubjects: [{ code: String, name: String }],
  approvedDepartments: [{ name: String, description: String }],
  plan: {
    type: String,
    enum: ["Free", "Standard", "Premium"],
    default: "Free",
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
});

export default mongoose.model("College", collegeSchema);
