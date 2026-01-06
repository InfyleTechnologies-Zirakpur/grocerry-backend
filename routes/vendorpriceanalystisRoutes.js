const express = require("express");
const router = express.Router();
const vendorAuth = require("../middleware/vendorAuth");
const {
  getVendorPriceAnalystis,
} = require("../controllers/vendorpriceanalystisController");

// 🔐 Vendor protected route
router.use(vendorAuth);

// 📊 Analytics API
router.get("/", getVendorPriceAnalystis);

module.exports = router;
