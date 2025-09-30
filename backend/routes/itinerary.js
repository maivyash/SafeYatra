const express = require("express");
const { protect } = require("../middleware/auth");
const ItineraryItem = require("../models/ItineraryItem");

const router = express.Router();

// Create item
router.post("/", protect, async (req, res) => {
  try {
    const { place, date, notes } = req.body;
    if (!place || !date) {
      return res.status(400).json({ success: false, message: "place and date required" });
    }
    const item = await ItineraryItem.create({ userId: req.user._id, place, date, notes: notes || "" });
    return res.status(201).json({ success: true, item });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// List my items
router.get("/my", protect, async (req, res) => {
  try {
    const items = await ItineraryItem.find({ userId: req.user._id }).sort({ date: 1, createdAt: -1 });
    return res.json({ success: true, items });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// Delete item
router.delete("/:id", protect, async (req, res) => {
  try {
    const deleted = await ItineraryItem.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!deleted) return res.status(404).json({ success: false, message: "Not found" });
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// Admin/Police: list all items for a user
router.get("/user/:userId", async (req, res) => {
  try {
    const items = await ItineraryItem.find({ userId: req.params.userId }).sort({ date: 1 });
    return res.json({ success: true, items });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;



