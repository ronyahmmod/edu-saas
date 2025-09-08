import mongoose from "mongoose";
import { Schema, SchemaTypes } from "mongoose";
import bcrypt from "bcrypt";
import { rolePermissions } from "../config/rbac.js";

const userSchema = new Schema({
  tenant: { type: SchemaTypes.ObjectId, ref: "College", required: true },
  userName: { type: String, required: false, minLength: 3 },
  email: { type: String, required: true, lowercase: true },
  phone: { type: String, required: true, unique: true },
  passwordHash: {
    type: String,
    required: true,
    select: false,
  },

  roles: {
    type: [String],
    enum: ["student", "admin", "super-admin", "teacher", "staff", "principal"],
    default: ["student"],
  },
  permissions: {
    type: [String],
    default: [],
  },

  linkedProfile: {
    type: Schema.Types.ObjectId,
    refPath: "profileModel",
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
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date, default: null },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
  otp: String,
  otpExpires: String,
  resetPasswordToken: String,
  resetPasswordExpires: String,
});

// Password Hashing Pre Save Hook

userSchema.pre("save", async function (next) {
  if (!this.isModified("passwordHash")) return next();
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);

  if (this.isNew) {
    console.log("New is running..");
    let perms = [];
    this.roles.forEach((role) => {
      if (rolePermissions[role]) {
        perms = perms.concat(rolePermissions[role]);
      }
    });
    this.permissions = [...new Set([...this.permissions, ...perms])];
  }
  next();
});

// Instance Method: Password Comparison
userSchema.methods.verifyPassword = async function (inputPassword) {
  return bcrypt.compare(inputPassword, this.passwordHash);
};

userSchema.methods.isLocked = function () {
  return this.isLocked && this.lockUntil > Date.now();
};

export default mongoose.model("User", userSchema);
