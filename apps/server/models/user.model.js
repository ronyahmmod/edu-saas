import mongoose from "mongoose";
import { Schema, SchemaTypes } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema({
  tenant: { type: SchemaTypes.ObjectId, ref: "College", required: true },
  userName: { type: String, required: true, unique: true, minLength: 3 },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, required: true, unique: true },
  passwordHash: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    required: true,
  },

  linkedProfile: {
    type: Schema.Types.ObjectId,
    refPath: "profileModel",
    default: "Student",
  },

  profileModel: {
    type: String,
    enum: ["Student", "Teacher", "Admin"],
  },

  status: {
    type: String,
    enum: ["active", "pending", "banned"],
    default: "active",
  },

  lastLogin: {
    type: Date,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Password Hashing Pre Save Hook

userSchema.pre("save", async function (next) {
  if (!this.isModified("passwordHash")) return next();
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

// Instance Method: Password Comparison
userSchema.methods.verifyPassword = async function (inputPassword) {
  return bcrypt.compare(inputPassword, this.passwordHash);
};

export default mongoose.model("User", userSchema);
