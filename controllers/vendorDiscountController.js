// const VendorDiscount = require("../models/VendorDiscountModel");

// /* =====================================================
//    CREATE DISCOUNT
// ===================================================== */
// exports.createDiscount = async (req, res) => {
//   try {
//     const vendorId = req.vendor._id;

//     const {
//       discountName,
//       description,
//       discountType,
//       discountValue,
//       applyOn,
//       products,
//       categories,
//       startDate,
//       endDate,
//       minOrderAmount,
//       maxDiscountAmount,
//     } = req.body;

//     if (!discountName || !discountType || !discountValue || !startDate || !endDate) {
//       return res.status(400).json({
//         success: false,
//         message: "Required fields missing",
//       });
//     }

//     const discount = await VendorDiscount.create({
//       vendor: vendorId,
//       discountName,
//       description,
//       discountType,
//       discountValue,
//       applyOn,
//       products: applyOn === "products" ? products || [] : [],
//       categories: applyOn === "categories" ? categories || [] : [],
//       startDate,
//       endDate,
//       minOrderAmount,
//       maxDiscountAmount,
//       status: "active",
//     });

//     res.status(201).json({
//       success: true,
//       message: "Discount created successfully",
//       discount,
//     });
//   } catch (err) {
//     console.error("CREATE DISCOUNT ERROR:", err);
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

// /* =====================================================
//    GET ALL DISCOUNTS (VENDOR)
// ===================================================== */
// exports.getVendorDiscounts = async (req, res) => {
//   try {
//     const vendorId = req.vendor._id;

//     const discounts = await VendorDiscount.find({ vendor: vendorId })
//       .sort({ createdAt: -1 });

//     res.json({
//       success: true,
//       data: discounts,
//     });
//   } catch (err) {
//     console.error("GET DISCOUNT ERROR:", err);
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

// /* =====================================================
//    UPDATE DISCOUNT
// ===================================================== */
// exports.updateDiscount = async (req, res) => {
//   try {
//     const vendorId = req.vendor._id;
//     const { id } = req.params;

//     const discount = await VendorDiscount.findOne({
//       _id: id,
//       vendor: vendorId,
//     });

//     if (!discount) {
//       return res.status(404).json({
//         success: false,
//         message: "Discount not found",
//       });
//     }

//     Object.assign(discount, req.body);
//     await discount.save();

//     res.json({
//       success: true,
//       message: "Discount updated successfully",
//       discount,
//     });
//   } catch (err) {
//     console.error("UPDATE DISCOUNT ERROR:", err);
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

// /* =====================================================
//    DELETE DISCOUNT
// ===================================================== */
// exports.deleteDiscount = async (req, res) => {
//   try {
//     const vendorId = req.vendor._id;
//     const { id } = req.params;

//     const discount = await VendorDiscount.findOneAndDelete({
//       _id: id,
//       vendor: vendorId,
//     });

//     if (!discount) {
//       return res.status(404).json({
//         success: false,
//         message: "Discount not found",
//       });
//     }

//     res.json({
//       success: true,
//       message: "Discount deleted successfully",
//     });
//   } catch (err) {
//     console.error("DELETE DISCOUNT ERROR:", err);
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

// /* =====================================================
//    TOGGLE STATUS (ACTIVE / INACTIVE)
// ===================================================== */
// exports.toggleDiscountStatus = async (req, res) => {
//   try {
//     const vendorId = req.vendor._id;
//     const { id } = req.params;

//     const discount = await VendorDiscount.findOne({
//       _id: id,
//       vendor: vendorId,
//     });

//     if (!discount) {
//       return res.status(404).json({
//         success: false,
//         message: "Discount not found",
//       });
//     }

//     discount.status =
//       discount.status === "active" ? "inactive" : "active";

//     await discount.save();

//     res.json({
//       success: true,
//       message: "Status updated",
//       status: discount.status,
//     });
//   } catch (err) {
//     console.error("STATUS ERROR:", err);
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };
const VendorDiscount = require("../models/VendorDiscountModel");

/* ================= CREATE ================= */
exports.createDiscount = async (req, res) => {
  try {
    const vendorId = req.vendor._id;

    const {
      discountName,
      description,
      discountType,
      discountValue,
      applyOn,
      products,
      categories,
      quantityRules,
      startDate,
      endDate,
    } = req.body;

    if (!discountName || !discountType || !startDate || !endDate) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    if (discountType === "quantity" && (!quantityRules || !quantityRules.length)) {
      return res.status(400).json({
        success: false,
        message: "Quantity rules required",
      });
    }

    const discount = await VendorDiscount.create({
      vendor: vendorId,
      discountName,
      description,
      discountType,
      discountValue: discountType === "quantity" ? 0 : discountValue,
      quantityRules: discountType === "quantity" ? quantityRules : [],
      applyOn,
      products: applyOn === "products" ? products : [],
      categories: applyOn === "categories" ? categories : [],
      startDate,
      endDate,
      status: "active",
    });

    res.json({ success: true, discount });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= READ ================= */
exports.getVendorDiscounts = async (req, res) => {
  const discounts = await VendorDiscount.find({ vendor: req.vendor._id });
  res.json({ success: true, data: discounts });
};

/* ================= UPDATE ================= */
exports.updateDiscount = async (req, res) => {
  const discount = await VendorDiscount.findOneAndUpdate(
    { _id: req.params.id, vendor: req.vendor._id },
    req.body,
    { new: true }
  );
  res.json({ success: true, discount });
};

/* ================= DELETE ================= */
exports.deleteDiscount = async (req, res) => {
  await VendorDiscount.findOneAndDelete({
    _id: req.params.id,
    vendor: req.vendor._id,
  });
  res.json({ success: true });
};

/* ================= TOGGLE ================= */
exports.toggleDiscountStatus = async (req, res) => {
  const discount = await VendorDiscount.findOne({
    _id: req.params.id,
    vendor: req.vendor._id,
  });

  discount.status = discount.status === "active" ? "inactive" : "active";
  await discount.save();

  res.json({ success: true, status: discount.status });
};
