// backend/models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  category: String,
  image: String,
  images: [String], // for multiple images
  active: { type: Boolean, default: true },
});

module.exports = mongoose.model("Product", productSchema);
