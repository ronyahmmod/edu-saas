import mongoose, { Schema } from "mongoose";

const postofficeSchema = new Schema({
  name: { type: String, required: true },
  postCode: { type: Number, required: true },
  upazila: { type: Schema.Types.ObjectId, ref: "Upazila" },
});

export default mongoose.model("PostOffice", postofficeSchema);
