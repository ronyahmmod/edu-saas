import mongoose from "mongoose";
import { Schema } from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    actorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    actorRole: { type: String, required: true },
    action: {
      type: String,
      enum: ["CREATE", "READ", "UPDATE", "DELETE", "EXPORT"],
      required: true,
    },
    entity: {
      type: { type: String, required: true },
      id: { type: Schema.Types.ObjectId, required: true },
    },
    changes: {
      old: { type: Object },
      new: { type: Object },
    },
    ip: String,
    userAgent: String,
    timestamp: { type: Date, default: Date.now },
    reason: String,
  },
  { timestamps: true }
);

export default mongoose.model("AuditLog", auditLogSchema);
