const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Products = require("../models/Products");

module.exports = {
  // Hàm lấy danh sách đơn hàng
  getUserOrders: async (req, res) => {
    const userId = req.params.id;
    try {
      // Tìm các đơn hàng của người dùng dựa trên userId
      const userOrders = await Order.find({ userId })
        .sort({ createdAt: -1 })
        .populate({
          path: "products.orderItem",
          select: "title price imageUrl",
        })
        .exec();

      res.status(200).json(userOrders);
    } catch (error) {
      res.status(500).json("Một số thứ đã xảy ra sai sót");
    }
  },

  // Hàm đặt hàng
  createOrder: async (req, res) => {
    const { userId, products, total, address, phone, orderType } = req.body;
    try {
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
        phone,
      });

      await newOrder.save();

      // Xóa các mặt hàng trong giỏ hàng sau khi đặt hàng thành công nếu đơn hàng từ giỏ hàng
      if (orderType === "cart") {
        await Cart.findOneAndDelete({ userId });

        // Cập nhật tồn kho sản phẩm bằng cách trừ đi số lượng đặt hàng cho đơn hàng trong giỏ hàng
        for (const item of products) {
          const { cartItem, quantity } = item;
          await Products.findByIdAndUpdate(cartItem._id, {
            $inc: { quantity: -quantity },
          });
        }
      } else if (orderType === "buyNow") {
        // Cập nhật tồn kho sản phẩm bằng cách trừ số lượng đặt hàng cho đơn hàng mua ngay
        await Products.findByIdAndUpdate(products.productId, {
          $inc: { quantity: -products.quantity },
        });
      }

      res.status(201).json("Đơn hàng được đặt thành công");
    } catch (error) {
      res.status(500).json("Một số thứ đã xảy ra sai sót");
    }
  },
};
