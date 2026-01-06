const mongoose = require("mongoose");

const VendorSubcategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: null,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const VendorCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: null,
    },
    subcategories: [VendorSubcategorySchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("VendorCategory", VendorCategorySchema);
