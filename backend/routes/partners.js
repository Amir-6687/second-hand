const express = require("express");
const router = express.Router();
const Partner = require("../models/Partner");
const { authMiddleware } = require("../middleware/auth");

// Get all active partners for public view
router.get("/", async (req, res) => {
  try {
    const { category, partnershipType, search } = req.query;

    let query = { isActive: true };

    // Filter by category
    if (category && category !== "all") {
      query.category = category;
    }

    // Filter by partnership type
    if (partnershipType && partnershipType !== "all") {
      query.partnershipType = partnershipType;
    }

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { services: { $in: [new RegExp(search, "i")] } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const partners = await Partner.find(query).sort({
      displayOrder: 1,
      createdAt: -1,
    });

    res.json(partners);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all partners for admin (including inactive)
router.get("/admin", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const { category, partnershipType, search } = req.query;

    let query = {};

    // Filter by category
    if (category && category !== "all") {
      query.category = category;
    }

    // Filter by partnership type
    if (partnershipType && partnershipType !== "all") {
      query.partnershipType = partnershipType;
    }

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { services: { $in: [new RegExp(search, "i")] } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const partners = await Partner.find(query).sort({
      displayOrder: 1,
      createdAt: -1,
    });

    res.json(partners);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single partner by ID
router.get("/:id", async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);

    if (!partner) {
      return res.status(404).json({ error: "Partner not found" });
    }

    // If partner is inactive and user is not admin, return 404
    if (!partner.isActive && (!req.user || req.user.role !== "admin")) {
      return res.status(404).json({ error: "Partner not found" });
    }

    res.json(partner);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new partner (admin only)
router.post("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const partner = new Partner(req.body);
    await partner.save();

    res.status(201).json(partner);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update partner (admin only)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const partner = await Partner.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!partner) {
      return res.status(404).json({ error: "Partner not found" });
    }

    res.json(partner);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete partner (admin only)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const partner = await Partner.findByIdAndDelete(req.params.id);

    if (!partner) {
      return res.status(404).json({ error: "Partner not found" });
    }

    res.json({ message: "Partner deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get partner categories
router.get("/categories/list", async (req, res) => {
  try {
    const categories = [
      { value: "education", label: "آموزش و تعلیم", icon: "🎓" },
      { value: "natural_products", label: "محصولات طبیعی", icon: "🌿" },
      { value: "fashion", label: "مد و لباس", icon: "👗" },
      { value: "health_wellness", label: "سلامت و تندرستی", icon: "💊" },
      { value: "beauty", label: "زیبایی", icon: "💄" },
      { value: "sustainability", label: "پایداری", icon: "♻️" },
      { value: "other", label: "سایر", icon: "🔗" },
    ];

    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get partnership types
router.get("/types/list", async (req, res) => {
  try {
    const types = [
      { value: "geschaeftspartner", label: "Geschäftspartner", icon: "🤝" },
      { value: "synergin", label: "Synergin", icon: "⚡" },
    ];

    res.json(types);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
