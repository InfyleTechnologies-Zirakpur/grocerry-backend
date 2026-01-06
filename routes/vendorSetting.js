const express = require("express");
const router = express.Router();
const VendorSetting = require("../models/VendorSetting");
const vendorAuth = require("../middleware/vendorAuth");

/* =========================
   GET OWN STATUS
========================= */
router.get("/me", vendorAuth, async (req, res) => {
  let setting = await VendorSetting.findOne({
    vendorId: req.vendor._id,
  });

  if (!setting) {
    setting = await VendorSetting.create({
      vendorId: req.vendor._id,
      vendorActive: true,
    });
  }

  res.json({ vendorActive: setting.vendorActive });
});

/* =========================
   TOGGLE WEBSITE PRICE
========================= */
router.put("/toggle", vendorAuth, async (req, res) => {
  let setting = await VendorSetting.findOne({
    vendorId: req.vendor._id,
  });

  if (!setting) {
    setting = await VendorSetting.create({
      vendorId: req.vendor._id,
    });
  }

  setting.vendorActive = !setting.vendorActive;
  await setting.save();

  res.json({
    success: true,
    vendorActive: setting.vendorActive,
  });
});

module.exports = router;
