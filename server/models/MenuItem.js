const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  desc:      { type: String, required: true },
  price:     { type: Number, required: true, min: 0 },
  category:  { type: String, required: true, enum: ["breakfast", "lunch", "dinner"] },
  tag:       { type: String, default: "" },
  img:       { type: String, default: "🍽️" },
  imageUrl:  { type: String, default: "" },
  imageId:   { type: String, default: "" },
  available: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("MenuItem", menuItemSchema);