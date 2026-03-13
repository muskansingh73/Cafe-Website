const express = require("express");
const jwt     = require("jsonwebtoken");
const Admin   = require("../models/Admin");

const router = express.Router();

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
}

// Login
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Username and password required" });
    }
    const admin = await Admin.findOne({ username });
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid username or password" });
    }
    const token = signToken(admin._id);
    res.json({
      success: true,
      token,
      admin: { id: admin._id, name: admin.name, role: admin.role, avatar: admin.avatar, username: admin.username },
    });
  } catch (err) { next(err); }
});

// Get current admin
router.get("/me", async (req, res, next) => {
  res.json({ success: true });
});

// Seed admin accounts
router.post("/seed", async (req, res, next) => {
  try {
    const exists = await Admin.findOne({ username: "admin" });
    if (exists) return res.json({ success: false, message: "Already seeded" });

    await Admin.create({ username: "admin",   password: "maison2026", name: "Head Administrator", role: "Super Admin", avatar: "👑" });
    await Admin.create({ username: "manager", password: "doree123",   name: "Floor Manager",      role: "Manager",    avatar: "🧑‍💼" });

    res.json({ success: true, message: "Admin accounts created ✓" });
  } catch (err) { next(err); }
});

module.exports = router;