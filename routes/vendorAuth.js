// const express = require("express");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const Vendor = require("../models/Vendor");

// const router = express.Router();

// /* =========================
//    VENDOR SIGNUP
// ========================= */
// router.post("/signup", async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     const existing = await Vendor.findOne({ email });
//     if (existing) {
//       return res.status(400).json({
//         success: false,
//         message: "Vendor already exists",
//       });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     await Vendor.create({
//       name,
//       email,
//       password: hashedPassword,
//       status: "PENDING",
//     });

//     res.json({
//       success: true,
//       message: "Signup successful. Waiting for admin approval.",
//     });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: "Signup failed",
//     });
//   }
// });

// /* =========================
//    VENDOR LOGIN (EMAIL + PASSWORD)
// ========================= */
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const vendor = await Vendor.findOne({ email });
//     if (!vendor) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid email or password",
//       });
//     }

//     // 🔒 BLOCK LOGIN IF NOT APPROVED
//     if (vendor.status !== "APPROVED") {
//       return res.status(403).json({
//         success: false,
//         message: "Your account is not approved by admin yet",
//       });
//     }

//     const isMatch = await bcrypt.compare(password, vendor.password);
//     if (!isMatch) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid email or password",
//       });
//     }

//     const token = jwt.sign(
//       { id: vendor._id, role: "vendor" },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     res.json({
//       success: true,
//       token,
//       vendor: {
//         id: vendor._id,
//         name: vendor.name,
//         email: vendor.email,
//       },
//     });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: "Login failed",
//     });
//   }
// });

// module.exports = router;
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Vendor = require("../models/Vendor");
const vendorAuth = require("../middleware/vendorAuth");

const {
  updateVendorPassword,
} = require("../controllers/vendorAuthController");

const router = express.Router();

/* =========================
   VENDOR SIGNUP
========================= */
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await Vendor.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Vendor already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Vendor.create({
      name,
      email,
      password: hashedPassword,
      status: "PENDING",
    });

    res.json({
      success: true,
      message: "Signup successful. Waiting for admin approval.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Signup failed",
    });
  }
});

/* =========================
   VENDOR LOGIN
========================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const vendor = await Vendor.findOne({ email });
    if (!vendor) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (vendor.status !== "APPROVED") {
      return res.status(403).json({
        success: false,
        message: "Your account is not approved by admin yet",
      });
    }

    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: vendor._id, role: "vendor" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      vendor: {
        id: vendor._id,
        name: vendor.name,
        email: vendor.email,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
});

/* =========================
   UPDATE PASSWORD (PROTECTED)
========================= */
router.put("/update-password", vendorAuth, updateVendorPassword);

module.exports = router;
