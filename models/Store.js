const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["Hub Store", "Dark Store", "Warehouse"],
      default: "Hub Store",
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    address: { type: String },
    openingTime: { type: String },
    closingTime: { type: String },

    ordersToday: { type: Number, default: 0 },
    avgTime: { type: Number, default: 0 }, // minutes
    riders: { type: Number, default: 0 },
    todayRevenue: { type: Number, default: 0 },
    capacityUtilization: { type: Number, default: 0 },
    stockAlerts: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Store", storeSchema);
