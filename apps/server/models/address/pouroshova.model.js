import mongoose, { Schema } from "mongoose";

const pouroshovaSchema = new Schema({
  name: { type: String, required: true },
  upazila: { type: Schema.Types.ObjectId, ref: "Upazila" },
});

export default mongoose.model("Pouroshova", pouroshovaSchema);
