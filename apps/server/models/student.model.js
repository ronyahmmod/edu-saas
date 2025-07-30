import mongoose from "mongoose";
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  phone: String,
  profilePic: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Student", studentSchema);
