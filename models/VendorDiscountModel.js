// const mongoose = require("mongoose");

// const VendorDiscountSchema = new mongoose.Schema(
//   {
//     /* ================= BASIC INFO ================= */
//     vendor: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Vendor",
//       required: true,
//       index: true,
//     },

//     discountName: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     description: {
//       type: String,
//       trim: true,
//     },

//     /* ================= DISCOUNT TYPE ================= */
//     discountType: {
//       type: String,
//       enum: ["flat", "percentage"],
//       required: true,
//     },

//     discountValue: {
//       type: Number,
//       required: true,
//       min: 0,
//     },

//     /* ================= APPLY ON ================= */
//     applyOn: {
//       type: String,
//       enum: ["products", "categories", "all"],
//       default: "products",
//     },

//     products: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "VendorPrice", // product model
//       },
//     ],

//     categories: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Category",
//       },
//     ],

//     /* ================= DATE RANGE ================= */
//     startDate: {
//       type: Date,
//       required: true,
//     },

//     endDate: {
//       type: Date,
//       required: true,
//     },

//     /* ================= LIMITS ================= */
//     minOrderAmount: {
//       type: Number,
//       default: 0,
//     },

//     maxDiscountAmount: {
//       type: Number,
//       default: null, // for percentage cap
//     },

//     /* ================= STATUS ================= */
//     status: {
//       type: String,
//       enum: ["active", "inactive", "expired"],
//       default: "active",
//       index: true,
//     },

//     /* ================= META ================= */
//     createdBy: {
//       type: String,
//       default: "vendor",
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// /* ================= AUTO EXPIRE LOGIC ================= */
// VendorDiscountSchema.pre("save", function (next) {
//   const now = new Date();
//   if (this.endDate < now) {
//     this.status = "expired";
//   }
//   next();
// });

// /* ================= INDEXES ================= */
// VendorDiscountSchema.index({ vendor: 1, status: 1 });
// VendorDiscountSchema.index({ startDate: 1, endDate: 1 });

// module.exports = mongoose.model(
//   "VendorDiscount",
//   VendorDiscountSchema
// );
const mongoose = require("mongoose");

const VendorDiscountSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
      index: true,
    },

    discountName: {
      type: String,
      required: true,
      trim: true,
    },

    description: String,

    discountType: {
      type: String,
      enum: ["flat", "percentage", "quantity"],
      required: true,
    },

    discountValue: {
      type: Number,
      default: 0,
    },

    applyOn: {
      type: String,
      enum: ["all", "products", "categories"],
      default: "all",
    },

    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "VendorPrice",
      },
    ],

    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],

    /* ====== 🔥 QUANTITY RULES ====== */
    quantityRules: [
      {
        minQty: { type: Number, required: true },
        maxQty: { type: Number, default: null },
        discountType: {
          type: String,
          enum: ["flat", "percentage"],
          required: true,
        },
        discountValue: { type: Number, required: true },
      },
    ],

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    status: {
      type: String,
      enum: ["active", "inactive", "expired"],
      default: "active",
    },
  },
  { timestamps: true }
);

VendorDiscountSchema.pre("save", function (next) {
  if (this.endDate < new Date()) {
    this.status = "expired";
  }
  next();
});

module.exports = mongoose.model("VendorDiscount", VendorDiscountSchema);
