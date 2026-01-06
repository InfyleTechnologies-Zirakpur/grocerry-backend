
const mongoose = require("mongoose");

const vendorPriceSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    subcategory: {
      id: String,
      name: String,
      image: String,
    },

    basePrice: {
      type: Number,
      required: true,
    },

    profitLoss: {
      type: Number,
      default: 0,
    },

    salePrice: {
      type: Number,
      default: 0,
    },

    description: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
  default: "active",
    },
  },
  { timestamps: true }
);

/* 🔥 AUTO CALCULATION */
vendorPriceSchema.pre("save", function (next) {
  this.salePrice =
    Number(this.basePrice || 0) + Number(this.profitLoss || 0);
  next();
});

module.exports = mongoose.model("VendorPrice", vendorPriceSchema);
