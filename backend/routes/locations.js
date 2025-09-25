const express = require("express");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const router = express.Router();

// POST /api/data/reverse-geocode -> convert lat/lng to readable name (Nominatim)
let policeStations = [];

router.get("/police-stations", (req, res) => {
  try {
    const rawData = fs.readFileSync("../backend/policelocation.json", "utf8");
    policeStations = JSON.parse(rawData);
  } catch (err) {
    console.error("Error loading police station data:", err.message);
  }
  console.log(policeStations);

  res.json({
    success: true,
    count: policeStations.length,
    stations: policeStations,
  });
  console.log();
});

// Route: GET one police station by id
router.get("/police-stations/:id", (req, res) => {
  const station = policeStations.find((s) => s.station_id === req.params.id);
  if (!station) {
    return res.status(404).json({ success: false, message: "Not found" });
  }
  res.json({ success: true, station });
});
router.post("/reverse-geocode", async (req, res) => {
  const { lat, lng } = req.body || {};
  if (typeof lat !== "number" || typeof lng !== "number") {
    return res
      .status(400)
      .json({ success: false, message: "lat and lng required" });
  }
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`;
    const r = await axios.get(url, {
      headers: { "User-Agent": "WanderSafe/1.0" },
    });
    const display = r.data?.address
      ? [
          r.data.address.city,
          r.data.address.town,
          r.data.address.village,
          r.data.address.county,
          r.data.address.state,
        ]
          .filter(Boolean)
          .slice(0, 2)
          .join(", ")
      : r.data?.display_name || "Unknown location";
    return res.json({ success: true, locationName: display });
  } catch (err) {
    console.error("reverse geocode error:", err?.message || err);
    return res
      .status(500)
      .json({ success: false, message: "Reverse geocode failed" });
  }
});

// GET /api/data/safety-score -> static score (85)
router.get("/safety-score", (req, res) => {
  return res.json({ success: true, score: 85 });
});
router.get("/areas", async (req, res) => {
  try {
    const file = path.join(__dirname, "..", "dataset.json");
    const raw = await fs.promises.readFile(file, "utf8");
    const areas = JSON.parse(raw);
    return res.json({ success: true, areas });
  } catch (err) {
    console.error("areas read error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to load areas" });
  }
});
module.exports = router;
