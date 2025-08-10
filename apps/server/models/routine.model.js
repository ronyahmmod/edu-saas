import mongoose from "mongoose";
import { Schema } from "mongoose";

const routineSchema = new Schema(
  {
    subject: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: "User", // Role: teacher
      required: true,
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    semester: {
      type: Number,
      required: true,
    },
    section: {
      type: String, // e.g., "A", "B"
    },
    room: {
      type: String, // Room number or building-room format
      required: true,
    },
    day: {
      type: String,
      enum: [
        "Saturday",
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
      ],
      required: true,
    },
    startTime: {
      type: String, // e.g., "10:00"
      required: true,
    },
    endTime: {
      type: String, // e.g., "11:30"
      required: true,
    },
    tenant: {
      type: Schema.Types.ObjectId,
      ref: "College",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Routine", routineSchema);
