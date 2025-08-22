import mongoose from "mongoose";
import { Schema } from "mongoose";

const roleSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    permissions: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model("Role", roleSchema);
