const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
require("dotenv").config();
      
// ===== ROUTES IMPORTS =====
const adminAuthRoutes = require("./routes/adminAuthRoutes");
const userAuthRoutes = require("./routes/userAuthRoutes");
const priceRoutes = require("./routes/priceRoutes");
const brokerRoutes = require("./routes/brokerRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const priceReportRoutes = require("./routes/priceReportRoutes");
const vendorAuthRoutes = require("./routes/vendorAuth");
const adminVendorRoutes = require("./routes/adminVendor");
const vendorCategoryRoutes = require("./routes/vendorCategoryRoutes");
const vendorPriceAnalystisRoutes = require("./routes/vendorpriceanalystisRoutes");


// ===== APP INIT =====
const app = express();

// ===== MIDDLEWARES =====
app.use(express.json());
app.use(cors());

// ===== Ensure Uploads Folder Exists =====
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("📁 Created missing uploads folder");
}

// ===== MONGODB CONNECTION =====
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// ===== STATIC UPLOADS FOLDER =====
// Serves images publicly, e.g. http://localhost:7000/uploads/yourfile.png
app.use("/uploads", express.static(uploadDir));

// ===== ROUTES =====
app.use("/api/admin", adminAuthRoutes);
app.use("/api/user", userAuthRoutes);
app.use("/api/prices", priceRoutes); // ✅ Price CRUD Routes
app.use("/api/categories", categoryRoutes);
app.use("/api/price-report", priceReportRoutes);
app.use("/api/descriptions", require("./routes/descriptionRoutes"));
app.use("/api/settings", require("./routes/settingRoutes"));
app.use("/api/vendor", vendorAuthRoutes);
app.use("/api/admin", adminVendorRoutes);

app.use("/api/vendor/prices", require("./routes/vendorPriceRoutes"));
app.use("/api/vendor/categories", vendorCategoryRoutes);
app.use(
  "/api/vendor/vendorpriceanalystis",
  vendorPriceAnalystisRoutes
);
app.use(
  "/api/vendor/descriptions",
  require("./routes/vendorDescriptionRoutes")
);

app.use("/api/vendor/settings", require("./routes/vendorSetting"));
app.use("/api/vendor/discounts", require("./routes/vendorDiscountRoutes"));


// ===== HEALTH CHECK ROUTE =====
app.get("/", (req, res) => {
  res.send("🚀 Server running successfully");
});

// ===== 404 HANDLER =====
app.use("/api/*", (req, res) => {
  res.status(404).json({ success: false, error: "API route not found" });
});

// ===== GLOBAL ERROR HANDLER =====
app.use((err, req, res, next) => {
  console.error("🔥 Global Error:", err.message);
  res.status(500).json({ success: false, message: err.message });
});

// ===== SERVER START =====
// ===== SERVER START =====
const PORT = process.env.PORT || 7000;
app.listen(PORT, () =>
  console.log(`🌐 Server running on port ${PORT}...`)
);
