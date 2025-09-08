import mongoose from "mongoose";
import { Schema } from "mongoose";

const roleSchema = new Schema(
  {
    type: { type: String, required: true },
    permissions: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model("Role", roleSchema);
