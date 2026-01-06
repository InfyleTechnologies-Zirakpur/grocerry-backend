const bcrypt = require("bcryptjs");
const Vendor = require("../models/Vendor");

/* =========================
   UPDATE VENDOR PASSWORD
========================= */
exports.updateVendorPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Old password and new password are required",
      });
    }

    // vendorAuth middleware se aata hai
    const vendor = await Vendor.findById(req.vendor._id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, vendor.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    vendor.password = hashed;
    await vendor.save();

    res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
