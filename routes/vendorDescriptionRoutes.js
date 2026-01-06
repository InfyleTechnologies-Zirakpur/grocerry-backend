const express = require("express");
const vendorAuth = require("../middleware/vendorAuth");
const {
  createVendorDescription,
  getVendorDescriptions,
  updateVendorDescription,
  deleteVendorDescription,
} = require("../controllers/vendorDescriptionController");

const router = express.Router();

router.post("/", vendorAuth, createVendorDescription);
router.get("/", vendorAuth, getVendorDescriptions);
router.put("/:id", vendorAuth, updateVendorDescription);
router.delete("/:id", vendorAuth, deleteVendorDescription);

module.exports = router;
