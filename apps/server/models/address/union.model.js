import mongoose, { Schema } from "mongoose";

const unionSchema = new Schema({
  name: { type: String, required: true },
  upazila: { type: Schema.Types.ObjectId, ref: "Upazila" },
});

export default mongoose.model("Union", unionSchema);
