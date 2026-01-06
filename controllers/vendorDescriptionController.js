const VendorDescription = require("../models/vendorDescriptionModel");

/* ================= CREATE ================= */
exports.createVendorDescription = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });
    }

    const item = await VendorDescription.create({
      vendor: req.vendor._id,
      title,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Description created",
      data: item,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= GET (LOGGED-IN VENDOR) ================= */
exports.getVendorDescriptions = async (req, res) => {
  try {
    const items = await VendorDescription.find({
      vendor: req.vendor._id,
    }).sort({ createdAt: -1 });

    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= UPDATE ================= */
exports.updateVendorDescription = async (req, res) => {
  try {
    const { title, description } = req.body;

    const updated = await VendorDescription.findOneAndUpdate(
      {
        _id: req.params.id,
        vendor: req.vendor._id,
      },
      { title, description },
      { new: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Not found" });
    }

    res.json({
      success: true,
      message: "Updated successfully",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= DELETE ================= */
exports.deleteVendorDescription = async (req, res) => {
  try {
    const deleted = await VendorDescription.findOneAndDelete({
      _id: req.params.id,
      vendor: req.vendor._id,
    });

    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Not found" });
    }

    res.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
