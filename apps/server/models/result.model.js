const mongoose = require("mongoose");

const gradeScale = [
  { min: 80, gpa: 5.0, grade: "A+" },
  { min: 70, gpa: 4.0, grade: "A" },
  { min: 60, gpa: 3.5, grade: "A-" },
  { min: 50, gpa: 3.0, grade: "B" },
  { min: 40, gpa: 2.0, grade: "C" },
  { min: 33, gpa: 1.0, grade: "D" },
  { min: 0, gpa: 0.0, grade: "F" },
];

function getGPAAndGrade(totalMarks) {
  for (let scale of gradeScale) {
    if (totalMarks >= scale.min) {
      return { gpa: scale.gpa, grade: scale.grade };
    }
  }
  return { gpa: 0.0, grade: "F" };
}

const resultSchema = new mongoose.Schema(
  {
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true,
      index: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
    },
    exam: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
    session: { type: String, required: true },
    term: {
      type: String,
      enum: ["half-yearly", "annual", "test", "pre-board", "board"],
      required: true,
    },
    resultStatus: {
      type: String,
      enum: ["published", "draft", "rechecking"],
      default: "draft",
    },
    isFinal: { type: Boolean, default: false },

    subjects: [
      {
        subject: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Subject",
          required: true,
        },
        theoryMarks: Number,
        mcqMarks: Number,
        practicalMarks: Number,
        total: Number,
        grade: String,
        gpa: Number,
        status: {
          type: String,
          enum: ["passed", "failed", "absent"],
          default: "passed",
        },
        comment: String,
      },
    ],

    totalMarks: Number,
    averageGPA: Number,
    finalGrade: String,
    remarks: String,

    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    verified: { type: Boolean, default: false },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    verifiedAt: Date,

    attachments: [
      {
        filename: String,
        url: String,
        type: { type: String, enum: ["pdf", "image", "sheet"] },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Result", resultSchema);
