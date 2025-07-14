// backend/routes/profile.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { authMiddleware } = require("../middleware/auth");

// گرفتن پروفایل کاربر لاگین‌شده
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ویرایش پروفایل کاربر لاگین‌شده
router.put("/", authMiddleware, async (req, res) => {
  try {
    const { username, first_name, last_name, phone, address } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { username, first_name, last_name, phone, address },
      { new: true, runValidators: true }
    ).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// حذف حساب کاربری
router.delete("/", authMiddleware, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.userId);
    res.json({ message: "Account deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
