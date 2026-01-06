const mongoose = require("mongoose");

const priceSchema = new mongoose.Schema({
  name: { type: String, required: true },

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

  basePrice: { type: Number, required: true },
  profitLoss: { type: Number, default: 0 },
  salePrice: { type: Number, default: 0 },

  lockedPrice: { type: Number, default: 0 },     // Yesterday lock saved
  yesterdayLock: { type: Number, default: 0 },   // Day-before lock
  brokerDisplay: { type: Number, default: 0 },   // Teji/Maddi

  lastLockDate: { type: String, default: "" },   // yyyy-mm-dd format

  validTill: Date,
  description: String,
  image: String,

  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "inactive",
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Price", priceSchema);