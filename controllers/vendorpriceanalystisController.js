const VendorPriceAnalystis = require("../models/vendorpriceanalystisModel");

exports.getVendorPriceAnalystis = async (req, res) => {
  try {
    /* ================= VENDOR ================= */
    if (!req.vendor || !req.vendor._id) {
      return res.status(401).json({
        success: false,
        message: "Vendor not authenticated",
      });
    }

    const vendorId = req.vendor._id;
    const {
      type = "category",
      range = "weekly",
      startDate,
      endDate,
    } = req.query;

    /* ================= DATE FILTER ================= */
    let createdAt = {};

    if (range === "custom") {
      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: "startDate & endDate required",
        });
      }

      const s = new Date(startDate);
      const e = new Date(endDate);
      e.setHours(23, 59, 59, 999);

      createdAt = { $gte: s, $lte: e };
    } else if (range === "weekly") {
      createdAt = { $gte: new Date(Date.now() - 30 * 86400000) };
    } else if (range === "monthly") {
      createdAt = { $gte: new Date(Date.now() - 180 * 86400000) };
    } else if (range === "yearly") {
      createdAt = { $gte: new Date(Date.now() - 5 * 365 * 86400000) };
    } else {
      // daily
      createdAt = { $gte: new Date(Date.now() - 7 * 86400000) };
    }

    /* ================= MATCH ================= */
    const match = { vendor: vendorId };
    if (Object.keys(createdAt).length) {
      match.createdAt = createdAt;
    }

    /* ================= GROUP FIELD ================= */
    const groupField =
      type === "product"
        ? { $ifNull: ["$productName", "Unknown Product"] }
        : { $ifNull: ["$category", "Unknown Category"] };

    const dateFormat =
      range === "yearly"
        ? "%Y"
        : range === "monthly"
        ? "%Y-%m"
        : "%Y-%m-%d";

    /* ================= AGGREGATION ================= */
    const data = await VendorPriceAnalystis.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            name: groupField,
            date: {
              $dateToString: {
                format: dateFormat,
                date: "$createdAt",
                timezone: "Asia/Kolkata",
              },
            },
          },
          avgPrice: { $avg: "$price" },
        },
      },
      {
        $group: {
          _id: "$_id.name",
          prices: {
            $push: {
              date: "$_id.date",
              avgPrice: { $round: ["$avgPrice", 2] },
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    /* ================= SORT PRICES ================= */
    data.forEach((d) => {
      d.prices.sort((a, b) => a.date.localeCompare(b.date));
    });

    /* ================= RESPONSE ================= */
    return res.json({
      success: true,
      type,
      range,
      data,
    });
  } catch (err) {
    console.error("VENDOR ANALYTICS ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
