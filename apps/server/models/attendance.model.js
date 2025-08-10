import mongoose from "mongoose";
import { Schema } from "mongoose";

const attendanceSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    routine: {
      type: Schema.Types.ObjectId,
      ref: "Routine", // Which class period this attendance is for
      required: true,
    },
    status: {
      type: String,
      enum: ["present", "absent", "late", "leave"],
      default: "absent",
    },
    method: {
      type: String,
      enum: ["manual", "barcode", "device"],
      default: "manual",
    },
    classTeacher: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    recordedByDeviceId: String,
    geoLocation: {
      lat: Number,
      lng: Number,
    },
    notes: String,
    tenant: {
      type: Schema.Types.ObjectId,
      ref: "Institution",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Attendance", attendanceSchema);
