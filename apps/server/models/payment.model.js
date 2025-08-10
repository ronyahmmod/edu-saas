import mongoose, { Schema } from "mongoose";

export const PAYMENT_METHODS = [
  "cash",
  "bkash",
  "nagad",
  "rocket",
  "bank",
  "shurjopay",
];
export const PAYER_TYPES = [
  "student",
  "teacher",
  "admin",
  "committee",
  "institution",
];

const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "College", // or 'Institution' – whoever owns the payment context
      index: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    currency: {
      type: String,
      default: "BDT",
    },

    method: {
      type: String,
      required: true,
      enum: PAYMENT_METHODS,
    },

    status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "paid",
    },

    purpose: {
      type: String,
      required: true,
      enum: [
        "admission_fee",
        "monthly_fee",
        "exam_fee",
        "form_fillup",
        "center_fee",
        "donation",
        "event",
        "others",
      ],
    },

    payerType: {
      type: String,
      required: true,
      enum: PAYER_TYPES,
    },

    payer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "payerType",
    },

    referenceNo: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },

    transactionDetails: {
      gatewayTxnId: String,
      mfsTxnId: String,
      senderNumber: String,
      bankSlipNo: String,
      bankName: String,
      branchName: String,
      paymentScreenshotUrl: String,
    },

    paidAt: {
      type: Date,
      default: Date.now,
    },

    remarks: String,

    meta: {
      type: mongoose.Schema.Types.Mixed, // for any additional dynamic fields
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Payment", paymentSchema);
