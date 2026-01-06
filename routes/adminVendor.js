const express = require("express");
const Vendor = require("../models/Vendor");

const router = express.Router();

/* =========================
   GET ALL VENDORS
========================= */
router.get("/vendors", async (req, res) => {
  try {
    const vendors = await Vendor.find().sort({ createdAt: -1 });
    res.json({ success: true, vendors });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* =========================
   GET ONLY PENDING VENDORS
========================= */
router.get("/vendors/pending", async (req, res) => {
  try {
    const vendors = await Vendor.find({ status: "PENDING" });
    res.json({ success: true, vendors });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* =========================
   APPROVE VENDOR
========================= */
router.put("/vendors/:id/approve", async (req, res) => {
  try {
    await Vendor.findByIdAndUpdate(req.params.id, {
      status: "APPROVED",
    });

    res.json({
      success: true,
      message: "Vendor approved successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* =========================
   REJECT VENDOR
========================= */
router.put("/vendors/:id/reject", async (req, res) => {
  try {
    await Vendor.findByIdAndUpdate(req.params.id, {
      status: "REJECTED",
    });

    res.json({
      success: true,
      message: "Vendor rejected",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
