// backend/models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
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
});

module.exports = mongoose.model("Product", productSchema);
