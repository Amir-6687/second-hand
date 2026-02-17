// backend/models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number }, // قیمت اصلی قبل از تخفیف
  isDiscounted: { type: Boolean, default: false }, // آیا محصول تخفیف خورده
  discountLabel: { type: String, default: "Last Chance" }, // برچسب تخفیف
  description: String,
  zustand: String,
  width: Number,
  depth: Number,
  height: Number,
  brand: String,
  model: String,
  color: String,
  material: String,
  pattern: String,
  image: String,
  images: [String], // for multiple images
  active: { type: Boolean, default: true },
  ratings: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      rating: { type: Number, min: 1, max: 5 },
      comment: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("Product", productSchema);
