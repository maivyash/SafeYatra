const express = require("express");
const { protect } = require("../middleware/auth");
const FIR = require("../models/FIR");

const router = express.Router();

// Generate FIR number helper
const generateFirNumber = async () => {
  const count = await FIR.countDocuments();
  const seq = String(count + 1).padStart(3, "0");
  return `FIR/${new Date().getFullYear()}/${seq}`;
};

// Create FIR
router.post("/", protect, async (req, res) => {
  try {
    const { crimeType, location, description, reporterName, reporterPhone } = req.body;
    if (!crimeType || !location || !description || !reporterName || !reporterPhone) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const firNumber = await generateFirNumber();
    const now = new Date();
    const doc = await FIR.create({
      userId: req.user._id,
      firNumber,
      crimeType,
      location,
      description,
      reporterName,
      reporterPhone,
      date: now.toISOString().split("T")[0],
      time: now.toLocaleTimeString(),
    });

    // Emit socket to police dashboard if io is available on app
    try {
      const io = req.app.get("io");
      if (io) io.emit("newFIRReport", doc);
    } catch (_) {}

    return res.status(201).json({ success: true, report: doc });
  } catch (err) {
    console.error("Create FIR error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// List FIRs for current user
router.get("/my", protect, async (req, res) => {
  try {
    const items = await FIR.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return res.json({ success: true, reports: items });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// Admin/Police: list all FIRs
router.get("/", async (req, res) => {
  try {
    const items = await FIR.find().sort({ createdAt: -1 });
    return res.json({ success: true, reports: items });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// Update FIR status or assignment
router.put("/:id", async (req, res) => {
  try {
    const update = req.body || {};
    const doc = await FIR.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!doc) return res.status(404).json({ success: false, message: "Not found" });
    return res.json({ success: true, report: doc });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;



