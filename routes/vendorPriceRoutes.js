
// const express = require("express");
// const router = express.Router();
// const multer = require("multer");

// const upload = multer({ storage: multer.memoryStorage() });
// const vendorAuth = require("../middleware/vendorAuth");

// /* ================= CONTROLLER ================= */
// const {
//   getVendorPrices,
//   createVendorPrice,
//   updateVendorPrice,
//   deleteVendorPrice,
//   importVendorPrices,
//   exportVendorPrices,
//   exportSelectedVendorPrices,
// } = require("../controllers/vendorPriceController");

// /* ================= VENDOR AUTH ================= */
// router.use(vendorAuth);

// /* ================= CRUD ================= */
// router.get("/", getVendorPrices);

// router.post("/", upload.single("file"), createVendorPrice);

// router.put("/:id", upload.single("file"), updateVendorPrice);

// router.delete("/:id", deleteVendorPrice);

// /* ================= CSV IMPORT ================= */
// // POST /api/vendor/prices/import
// router.post(
//   "/import",
//   upload.single("file"),
//   importVendorPrices
// );

// /* ================= CSV EXPORT ALL ================= */
// // GET /api/vendor/prices/export
// router.get(
//   "/export",
//   exportVendorPrices
// );

// /* ================= CSV EXPORT SELECTED ================= */
// // POST /api/vendor/prices/export-selected
// router.post(
//   "/export-selected",
//   exportSelectedVendorPrices
// );

// module.exports = router;

const express = require("express");
const router = express.Router();
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });
const vendorAuth = require("../middleware/vendorAuth");

const {
  getVendorPrices,
  createVendorPrice,
  updateVendorPrice,
  deleteVendorPrice,
  importVendorPrices,
  exportVendorPrices,
   bulkDeleteVendorPrices,
  bulkUpdateVendorPrices,
} = require("../controllers/vendorPriceController");

/* 🔐 AUTH */
router.use(vendorAuth);

/* CRUD */
router.get("/", getVendorPrices);
router.post("/", upload.single("file"), createVendorPrice);
router.put("/:id", upload.single("file"), updateVendorPrice);
router.delete("/:id", deleteVendorPrice);

/* CSV */
router.post("/import", upload.single("file"), importVendorPrices);
router.get("/export", exportVendorPrices);

router.post("/bulk-delete", bulkDeleteVendorPrices);
router.post("/bulk-update", bulkUpdateVendorPrices);

module.exports = router;
