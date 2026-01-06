// // const jwt = require("jsonwebtoken");
// // const Vendor = require("../models/Vendor");

// // module.exports = async (req, res, next) => {
// //   try {
// //     const token =
// //       req.headers.authorization?.split(" ")[1] ||
// //       req.headers["x-vendor-token"];

// //     if (!token) {
// //       return res.status(401).json({ message: "Vendor token missing" });
// //     }

// //     const decoded = jwt.verify(token, process.env.JWT_SECRET);

// //     const vendor = await Vendor.findById(decoded.id);
// //     if (!vendor || vendor.status !== "approved") {
// //       return res.status(403).json({ message: "Vendor not approved" });
// //     }

// //     req.vendor = vendor; // 🔥 attach vendor
// //     next();
// //   } catch (err) {
// //     res.status(401).json({ message: "Invalid vendor token" });
// //   }
// // };

// const jwt = require("jsonwebtoken");
// const Vendor = require("../models/Vendor");

// module.exports = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization?.split(" ")[1];
//     if (!token) return res.status(401).json({ message: "No token" });

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const vendor = await Vendor.findById(decoded.id);

//     if (!vendor) return res.status(401).json({ message: "Invalid vendor" });

//     req.user = {
//       role: "vendor",
//       vendorId: vendor._id,
//     };

//     next();
//   } catch (err) {
//     res.status(401).json({ message: "Unauthorized" });
//   }
// };

const jwt = require("jsonwebtoken");
const Vendor = require("../models/Vendor");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const vendor = await Vendor.findById(decoded.id);

    if (!vendor) {
      return res.status(401).json({ message: "Invalid vendor" });
    }

    // 🔥 THIS LINE FIXES EVERYTHING
    req.vendor = vendor;

    next();
  } catch (err) {
    console.error("VENDOR AUTH ERROR:", err.message);
    res.status(401).json({ message: "Unauthorized" });
  }
};
