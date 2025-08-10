import mongoose from "mongoose";
import { Schema } from "mongoose";

const upazilaSchema = new Schema({
  name: { type: String, required: true },
  district: { type: Schema.Types.ObjectId, ref: "District" },
});

export default mongoose.model("Upazila", upazilaSchema);
