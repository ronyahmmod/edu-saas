import mongoose from "mongoose";
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  phone: String,
  profilePic: String,
  session: String,
  classRoll: String,
  group: String,
  documents: [{ url: String, name: String, format: String }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Student", studentSchema);
