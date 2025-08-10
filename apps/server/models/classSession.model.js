import mongoose from "mongoose";
import { Schema } from "mongoose";

const classSessionSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    routine: {
      type: Schema.Types.ObjectId,
      ref: "Routine",
      required: true,
    },
    isCancelled: {
      type: Boolean,
      default: false,
    },
    cancelledReason: String,
    attendanceTaken: {
      type: Boolean,
      default: false,
    },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    tenant: {
      type: Schema.Types.ObjectId,
      ref: "College",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ClassSession", classSessionSchema);
