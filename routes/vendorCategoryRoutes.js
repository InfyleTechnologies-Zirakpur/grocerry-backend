const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const {
  createVendorCategory,
  getVendorCategories,
  updateVendorCategory,
  deleteVendorCategory,
  addVendorSubcategory,
  updateVendorSubcategory,
  deleteVendorSubcategory,
} = require("../controllers/vendorCategoryController");

// ================= Vendor Category =================

// Create vendor category (with image)
router.post("/", upload.single("image"), createVendorCategory);

// Get all vendor categories
router.get("/", getVendorCategories);

// Update vendor category (name / image)
router.put("/:id", upload.single("image"), updateVendorCategory);

// Delete vendor category
router.delete("/:id", deleteVendorCategory);

// ================= Vendor Subcategory =================

// Add vendor subcategory
router.post("/:id/sub", upload.single("image"), addVendorSubcategory);

// Update vendor subcategory
router.put("/:id/sub/:subId", upload.single("image"), updateVendorSubcategory);

// Delete vendor subcategory
router.delete("/:id/sub/:subId", deleteVendorSubcategory);

module.exports = router;
