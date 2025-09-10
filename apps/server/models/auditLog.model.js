import mongoose from "mongoose";
import { Schema } from "mongoose";

const auditLogSchema = new mongoose.Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  action: String,
  ip: String,
  userAgent: String,
  createdAt: { type: Date, default: Date.now() },
});

export default mongoose.model("AuditLog", auditLogSchema);
