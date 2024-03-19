const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    products: [
      {
        orderItem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    // quantity: { type: Number, required: true },
    // subtotal: { type: Number, required: true },
    total: { type: Number, required: true },
    delivery_status: { type: String, default: "pending" },
    address: { type: String, required: true },
    // payment_status: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
