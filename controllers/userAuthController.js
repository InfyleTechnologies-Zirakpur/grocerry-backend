


const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ===================== REGISTER (PUBLIC) =====================
exports.userRegister = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashed,
      role: role || "user",
    });

    await user.save();
    res.status(201).json({ message: "Registration Successful", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ===================== LOGIN (PUBLIC) =====================
exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ message: "Login successful", token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ===================== CREATE USER (ADMIN CRUD) =====================
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashed,
      role: role || "user",
    });

    await user.save();
    res.status(201).json(user);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ===================== GET ALL USERS =====================
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().lean(); 
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ===================== UPDATE USER =====================
exports.updateUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const updateData = { name, email, role };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ===================== DELETE USER =====================
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

