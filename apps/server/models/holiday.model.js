import mongoose from "mongoose";
import { Schema } from "mongoose";

const holidaySchema = new Schema({
  date: {
    type: Date,
    required: true,
    unique: true,
  },
  reason: {
    type: String,
    required: true,
  },
  tenant: {
    type: Schema.Types.ObjectId,
    ref: "College",
    required: true,
  },
  isRecurring: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("Holiday", holidaySchema);
