import mongoose from "mongoose";
import { Schema } from "mongoose";

const divisionSchema = new Schema({
  name: { type: String, required: true },
});

export default mongoose.model("Division", divisionSchema);
