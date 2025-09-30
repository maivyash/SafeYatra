const express = require("express");
const { protect } = require("../middleware/auth");
const ShareContact = require("../models/ShareContact");

const router = express.Router();

// Add contacts (bulk or single)
router.post("/contacts", protect, async (req, res) => {
  try {
    const { contacts } = req.body;
    if (!Array.isArray(contacts) || contacts.length === 0) {
      return res.status(400).json({ success: false, message: "contacts array required" });
    }
    const docs = await ShareContact.insertMany(
      contacts.map((c) => ({ userId: req.user._id, name: c.name, email: c.email, phone: c.phone }))
    );
    return res.status(201).json({ success: true, contacts: docs });
  } catch (err) {
    console.error("add contacts error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// List my contacts
router.get("/contacts/my", protect, async (req, res) => {
  try {
    const docs = await ShareContact.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return res.json({ success: true, contacts: docs });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// Remove a contact
router.delete("/contacts/:id", protect, async (req, res) => {
  try {
    const deleted = await ShareContact.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!deleted) return res.status(404).json({ success: false, message: "Not found" });
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// Police: get contacts for a user
router.get("/contacts/user/:userId", async (req, res) => {
  try {
    const docs = await ShareContact.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    return res.json({ success: true, contacts: docs });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;



