const mongoose = require("mongoose");

const vendorSettingSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true,
    unique: true,
  },

  vendorActive: {
    type: Boolean,
    default: true, // true = price show
  },
});

module.exports = mongoose.model("VendorSetting", vendorSettingSchema);
