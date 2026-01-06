
const VendorPrice = require("../models/vendorPriceModel");
const Category = require("../models/categoryModel");
const cloudinary = require("../utils/cloudinary");
const csv = require("fast-csv");

/* ======================================================
   CLOUDINARY UPLOAD
====================================================== */
const uploadToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "vendor_prices" }, (err, result) => {
        if (err) reject(err);
        else resolve(result.secure_url);
      })
      .end(buffer);
  });

/* ======================================================
   GET ALL VENDOR PRICES
====================================================== */
exports.getVendorPrices = async (req, res) => {
  try {
    const data = await VendorPrice.find({
      vendor: req.vendor._id,
    }).populate("category", "_id name");

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ======================================================
   CREATE VENDOR PRICE (ONLY active / inactive)
====================================================== */
exports.createVendorPrice = async (req, res) => {
  try {
    const { name, category, basePrice, profitLoss, description, status } =
      req.body;

    if (!name || !category || basePrice === undefined) {
      return res.status(400).json({
        success: false,
        message: "Name, category & base price required",
      });
    }

    let image = "";
    if (req.file) {
      image = await uploadToCloudinary(req.file.buffer);
    }

    let subcategory = null;
    if (req.body.subcategory && req.body.subcategory !== "null") {
      try {
        subcategory = JSON.parse(req.body.subcategory);
      } catch {}
    }

    // ✅ FORCE ONLY active / inactive
    const finalStatus =
      status === "inactive" ? "inactive" : "active";

    const item = await VendorPrice.create({
      vendor: req.vendor._id,
      name: name.trim(),
      category,
      subcategory,
      basePrice: Number(basePrice),
      profitLoss: Number(profitLoss || 0),
      description: description || "",
      status: finalStatus,
      image,
    });

    res.json({ success: true, data: item });
  } catch (err) {
    console.error("CREATE ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ======================================================
   UPDATE VENDOR PRICE
====================================================== */
exports.updateVendorPrice = async (req, res) => {
  try {
    const item = await VendorPrice.findOne({
      _id: req.params.id,
      vendor: req.vendor._id,
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Not found",
      });
    }

    if (req.file) {
      item.image = await uploadToCloudinary(req.file.buffer);
    }

    if (req.body.name !== undefined)
      item.name = req.body.name.trim();

    if (req.body.description !== undefined)
      item.description = req.body.description;

    if (req.body.category !== undefined)
      item.category = req.body.category;

    if (req.body.subcategory && req.body.subcategory !== "null") {
      try {
        item.subcategory = JSON.parse(req.body.subcategory);
      } catch {}
    }

    if (req.body.basePrice !== undefined)
      item.basePrice = Number(req.body.basePrice);

    if (req.body.profitLoss !== undefined)
      item.profitLoss = Number(req.body.profitLoss);

    // ✅ ONLY active / inactive
    if (req.body.status) {
      item.status =
        req.body.status === "inactive" ? "inactive" : "active";
    }

    await item.save();

    res.json({ success: true, data: item });
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ======================================================
   DELETE VENDOR PRICE
====================================================== */
exports.deleteVendorPrice = async (req, res) => {
  try {
    await VendorPrice.findOneAndDelete({
      _id: req.params.id,
      vendor: req.vendor._id,
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ======================================================
   CSV IMPORT (CATEGORY NAME → ID, STATUS FIXED)
====================================================== */
// exports.importVendorPrices = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({
//         success: false,
//         message: "CSV file required",
//       });
//     }

//     const file = req.file.buffer.toString("utf-8");
//     const rows = [];

//     csv
//       .parseString(file, { headers: true })
//       .on("data", (row) => rows.push(row))
//       .on("end", async () => {
//         for (const r of rows) {
//           const categoryDoc = await Category.findOne({
//             name: new RegExp(`^${r.categoryName}$`, "i"),
//           });

//           if (!categoryDoc) continue;

//           let subcategory = null;
//           if (r.subcategory) {
//             try {
//               subcategory = JSON.parse(r.subcategory);
//             } catch {}
//           }

//           await VendorPrice.create({
//             vendor: req.vendor._id,
//             name: r.name?.trim(),
//             category: categoryDoc._id,
//             subcategory,
//             basePrice: Number(r.basePrice || 0),
//             profitLoss: Number(r.profitLoss || 0),
//             description: r.description || "",
//             status:
//               r.status === "inactive" ? "inactive" : "active",
//             image: "",
//           });
//         }

//         res.json({
//           success: true,
//           imported: rows.length,
//         });
//       });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

exports.importVendorPrices = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "CSV file required",
      });
    }

    const file = req.file.buffer.toString("utf-8");
    const rows = [];
    let importedCount = 0;

    csv
      .parseString(file, { headers: true, trim: true })
      .on("data", (row) => rows.push(row))
      .on("end", async () => {
        for (const r of rows) {
          // ✅ FIX 1: categoryName OR category (both supported)
          const categoryName = r.categoryName || r.category;
          if (!categoryName) continue;

          const categoryDoc = await Category.findOne({
            name: new RegExp(`^${categoryName}$`, "i"),
          });

          if (!categoryDoc) continue;

          // ✅ Safe subcategory parse
          let subcategory = null;
          if (r.subcategory) {
            try {
              subcategory =
                typeof r.subcategory === "string"
                  ? JSON.parse(r.subcategory)
                  : null;
            } catch {
              subcategory = null;
            }
          }

          await VendorPrice.create({
            vendor: req.vendor._id,
            name: r.name?.trim(),
            category: categoryDoc._id,
            subcategory,
            basePrice: Number(r.basePrice || 0),
            profitLoss: Number(r.profitLoss || 0),
            description: r.description || "",
            status: r.status === "inactive" ? "inactive" : "active",
            image: "",
          });

          importedCount++;
        }

        return res.json({
          success: true,
          imported: importedCount, // ✅ REAL imported count
        });
      });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


/* ======================================================
   CSV EXPORT ALL
====================================================== */
exports.exportVendorPrices = async (req, res) => {
  try {
    const data = await VendorPrice.find({
      vendor: req.vendor._id,
    }).populate("category", "name");

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=vendor_prices.csv"
    );
    res.setHeader("Content-Type", "text/csv");

    const csvStream = csv.format({ headers: true });
    csvStream.pipe(res);

    data.forEach((p) => {
      csvStream.write({
        id: p._id,
        name: p.name,
        categoryId: p.category?._id || "",
        categoryName: p.category?.name || "",
        subcategory: p.subcategory
          ? JSON.stringify(p.subcategory)
          : "",
        basePrice: p.basePrice,
        profitLoss: p.profitLoss,
        salePrice: p.salePrice,
        status: p.status,
        description: p.description,
      });
    });

    csvStream.end();
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ======================================================
   BULK DELETE VENDOR PRICES
====================================================== */
exports.bulkDeleteVendorPrices = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Product ids array required",
      });
    }

    const result = await VendorPrice.deleteMany({
      _id: { $in: ids },
      vendor: req.vendor._id, // 🔐 vendor safety
    });

    res.json({
      success: true,
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    console.error("BULK DELETE ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ======================================================
   BULK UPDATE VENDOR PRICES
====================================================== */
exports.bulkUpdateVendorPrices = async (req, res) => {
  try {
    const { products } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Products array required",
      });
    }

    let updated = 0;

    for (const p of products) {
      const item = await VendorPrice.findOne({
        _id: p.id,
        vendor: req.vendor._id, // 🔐 vendor safety
      });

      if (!item) continue;

      if (p.name !== undefined) item.name = p.name.trim();
      if (p.basePrice !== undefined)
        item.basePrice = Number(p.basePrice);
      if (p.profitLoss !== undefined)
        item.profitLoss = Number(p.profitLoss);
      if (p.description !== undefined)
        item.description = p.description;
      if (p.status !== undefined)
        item.status =
          p.status === "inactive" ? "inactive" : "active";

      await item.save(); // 🔥 salePrice auto-calc here
      updated++;
    }

    res.json({
      success: true,
      updated,
    });
  } catch (err) {
    console.error("BULK UPDATE ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
