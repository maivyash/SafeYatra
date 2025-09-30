const mongoose = require("mongoose");

const itineraryItemSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    place: { type: String, required: true },
    date: { type: String, required: true },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ItineraryItem", itineraryItemSchema);



