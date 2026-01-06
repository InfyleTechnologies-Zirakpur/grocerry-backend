const mongoose = require("mongoose");

const vendorPriceAnalystisSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
      index: true,
    },

    productName: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true } // createdAt used for analytics
);

module.exports =
  mongoose.models.VendorPriceAnalystis ||
  mongoose.model("VendorPriceAnalystis", vendorPriceAnalystisSchema);
