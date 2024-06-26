const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, require: true },
    supplier: { type: String, require: true },
    imageUrl: { type: String, require: true },
    price: { type: String, require: true },
    quantity: { type: Number, require: true, default: 1 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    description: { type: String, require: true },
    product_location: { type: String, require: true },
    favoriteCount: { type: Number, default: 0 },
    favoriteBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
