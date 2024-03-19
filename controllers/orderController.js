const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Products = require("../models/Products");

module.exports = {
  getUserOrders: async (req, res) => {
    const userId = req.params.id;

    try {
      const userOrders = await Order.find({ userId })
        .populate({
          path: "productId",
          select: "-description -product_location",
        })
        .exec();

      res.status(200).json(userOrders);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  createOrder: async (req, res) => {
    const { userId, products, total, address, orderType } = req.body;
    console.log(products);

    try {
      // Create a new order
      const newOrder = new Order({
        userId,
        products:
          orderType === "cart"
            ? products.map((item) => ({
                orderItem: item.cartItem._id,
                quantity: item.quantity,
              }))
            : [
                {
                  orderItem: products.productId,
                  quantity: products.quantity,
                },
              ],
        total,
        address,
      });
      // Save the new order to the database
      await newOrder.save();

      // Clear cart items after successful order if the order is from cart
      if (orderType === "cart") {
        await Cart.findOneAndDelete({ userId });

        // Update product inventory by subtracting ordered quantities
        for (const item of products) {
          const { cartItem, quantity } = item;
          await Products.findByIdAndUpdate(cartItem._id, {
            $inc: { quantity: -quantity },
          });
        }
      } else if (orderType === "buyNow") {
        // Update product inventory by subtracting ordered quantity for buyNow order
        await Products.findByIdAndUpdate(products.productId, {
          $inc: { quantity: -products.quantity },
        });
      }

      res.status(201).json("Order placed successfully");
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to place order" });
    }
  },
};
