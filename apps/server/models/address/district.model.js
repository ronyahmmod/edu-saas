import mongoose from "mongoose";
import { Schema } from "mongoose";

const districtSchema = new Schema({
  name: { type: String, required: true },
  division: { type: Schema.Types.ObjectId, ref: "Division" },
});

export default mongoose.model("District", districtSchema);
