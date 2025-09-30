const mongoose = require("mongoose");

const firSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    firNumber: { type: String, required: true, unique: true },
    crimeType: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "under_investigation", "resolved"],
      default: "pending",
    },
    reporterName: { type: String, required: true },
    reporterPhone: { type: String, required: true },
    assignedOfficer: { type: String, default: "Unassigned" },
    evidence: { type: [String], default: [] },
    date: { type: String },
    time: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FIR", firSchema);



