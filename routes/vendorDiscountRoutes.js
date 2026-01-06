// const express = require("express");
// const router = express.Router();

// const vendorAuth = require("../middleware/vendorAuth");
// const {
//   createDiscount,
//   getVendorDiscounts,
//   updateDiscount,
//   deleteDiscount,
//   toggleDiscountStatus,
// } = require("../controllers/vendorDiscountController");

// /* ================= PROTECTED ROUTES ================= */
// router.use(vendorAuth);

// /* CREATE */
// router.post("/", createDiscount);

// /* READ */
// router.get("/", getVendorDiscounts);

// /* UPDATE */
// router.put("/:id", updateDiscount);

// /* DELETE */
// router.delete("/:id", deleteDiscount);

// /* STATUS TOGGLE */
// router.patch("/:id/toggle-status", toggleDiscountStatus);

// module.exports = router;
const express = require("express");
const router = express.Router();
const vendorAuth = require("../middleware/vendorAuth");

const {
  createDiscount,
  getVendorDiscounts,
  updateDiscount,
  deleteDiscount,
  toggleDiscountStatus,
} = require("../controllers/vendorDiscountController");

router.use(vendorAuth);

router.post("/", createDiscount);
router.get("/", getVendorDiscounts);
router.put("/:id", updateDiscount);
router.delete("/:id", deleteDiscount);
router.patch("/:id/toggle-status", toggleDiscountStatus);

module.exports = router;
