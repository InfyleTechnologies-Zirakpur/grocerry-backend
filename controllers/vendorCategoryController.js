const VendorCategory = require("../models/vendorCategoryModel");
const cloudinary = require("../utils/cloudinary");

/** Upload buffer to cloudinary */
const uploadToCloudinary = (buffer, folder = "vendor_category_images") => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder }, (err, result) => {
        if (err) reject(err);
        else resolve(result.secure_url);
      })
      .end(buffer);
  });
};

/** Extract Cloudinary publicId */
const extractPublicId = (url) => {
  try {
    const parts = url.split("/");
    const last = parts.pop();
    return last.split(".")[0];
  } catch {
    return null;
  }
};

/* ================= CREATE VENDOR CATEGORY ================= */
exports.createVendorCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name)
      return res.status(400).json({ success: false, message: "Name required" });

    const exists = await VendorCategory.findOne({ name: name.trim() });
    if (exists)
      return res
        .status(400)
        .json({ success: false, message: "Vendor category already exists" });

    let image = null;
    if (req.file) {
      image = await uploadToCloudinary(req.file.buffer);
    }

    const category = await VendorCategory.create({
      name: name.trim(),
      image,
    });

    res.status(201).json({ success: true, category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= GET ALL ================= */
exports.getVendorCategories = async (req, res) => {
  try {
    const categories = await VendorCategory.find().sort({ createdAt: -1 });
    res.json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= UPDATE CATEGORY ================= */
exports.updateVendorCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const category = await VendorCategory.findById(id);
    if (!category)
      return res
        .status(404)
        .json({ success: false, message: "Vendor category not found" });

    if (name) category.name = name.trim();

    if (req.file) {
      const newImage = await uploadToCloudinary(req.file.buffer);
      if (category.image) {
        const pid = extractPublicId(category.image);
        if (pid) cloudinary.uploader.destroy(`vendor_category_images/${pid}`);
      }
      category.image = newImage;
    }

    await category.save();
    res.json({ success: true, category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= DELETE CATEGORY ================= */
exports.deleteVendorCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await VendorCategory.findById(id);
    if (!category)
      return res
        .status(404)
        .json({ success: false, message: "Vendor category not found" });

    if (category.image) {
      const pid = extractPublicId(category.image);
      if (pid) cloudinary.uploader.destroy(`vendor_category_images/${pid}`);
    }

    for (const sub of category.subcategories) {
      if (sub.image) {
        const pid = extractPublicId(sub.image);
        if (pid) cloudinary.uploader.destroy(`vendor_category_images/${pid}`);
      }
    }

    await category.deleteOne();

    res.json({ success: true, message: "Vendor category deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= ADD SUBCATEGORY ================= */
exports.addVendorSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name)
      return res
        .status(400)
        .json({ success: false, message: "Subcategory name required" });

    const category = await VendorCategory.findById(id);
    if (!category)
      return res
        .status(404)
        .json({ success: false, message: "Vendor category not found" });

    const exists = category.subcategories.find(
      (s) => s.name.toLowerCase() === name.trim().toLowerCase()
    );
    if (exists)
      return res
        .status(400)
        .json({ success: false, message: "Subcategory already exists" });

    let image = null;
    if (req.file) {
      image = await uploadToCloudinary(req.file.buffer);
    }

    category.subcategories.push({ name: name.trim(), image });
    await category.save();

    res.status(201).json({
      success: true,
      subcategory: category.subcategories.at(-1),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= UPDATE SUBCATEGORY ================= */
exports.updateVendorSubcategory = async (req, res) => {
  try {
    const { id, subId } = req.params;
    const { name, active } = req.body;

    const category = await VendorCategory.findById(id);
    if (!category)
      return res
        .status(404)
        .json({ success: false, message: "Vendor category not found" });

    const sub = category.subcategories.id(subId);
    if (!sub)
      return res
        .status(404)
        .json({ success: false, message: "Subcategory not found" });

    if (name) sub.name = name.trim();
    if (active !== undefined) sub.active = active === "true" || active === true;

    if (req.file) {
      const newImage = await uploadToCloudinary(req.file.buffer);
      if (sub.image) {
        const pid = extractPublicId(sub.image);
        if (pid) cloudinary.uploader.destroy(`vendor_category_images/${pid}`);
      }
      sub.image = newImage;
    }

    await category.save();
    res.json({ success: true, subcategory: sub });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= DELETE SUBCATEGORY ================= */
exports.deleteVendorSubcategory = async (req, res) => {
  try {
    const { id, subId } = req.params;

    const category = await VendorCategory.findById(id);
    if (!category)
      return res
        .status(404)
        .json({ success: false, message: "Vendor category not found" });

    const sub = category.subcategories.id(subId);
    if (!sub)
      return res
        .status(404)
        .json({ success: false, message: "Subcategory not found" });

    if (sub.image) {
      const pid = extractPublicId(sub.image);
      if (pid) cloudinary.uploader.destroy(`vendor_category_images/${pid}`);
    }

    sub.deleteOne();
    await category.save();

    res.json({ success: true, message: "Vendor subcategory deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
