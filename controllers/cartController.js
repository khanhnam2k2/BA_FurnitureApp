const Product = require("../models/Products");
const Cart = require("../models/Cart");

module.exports = {
  // Hàm thêm sp vào giỏ hàng
  addToCart: async (req, res) => {
    const { userId, cartItem, quantity } = req.body;
    try {
      const cart = await Cart.findOne({ userId });
      if (cart) {
        const existingProduct = cart.products.find(
          (product) => product.cartItem.toString() === cartItem
        );
        if (existingProduct) {
          existingProduct.quantity += quantity;
        } else {
          cart.products.push({ cartItem, quantity });
        }

        await cart.save();
        res.status(200).json("Sản phẩm đã được thêm vào giỏ hàng");
      } else {
        const newCart = new Cart({
          userId,
          products: [
            {
              cartItem,
              quantity: quantity,
            },
          ],
        });
        await newCart.save();
        res.status(200).json("Sản phẩm đã được thêm vào giỏ hàng");
      }
    } catch (error) {
      res.status(500).json("Một số thứ đã xảy ra sai sót");
    }
  },

  // Hàm lấy danh sách sản phẩm trong giỏ hàng
  getCart: async (req, res) => {
    const userId = req.params.id;
    try {
      const cart = await Cart.find({ userId }).populate(
        "products.cartItem",
        "_id title supplier price imageUrl"
      );
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json("Một số thứ đã xảy ra sai sót");
    }
  },

  // Hàm xóa sản phẩm trong giỏ hàng
  deleteCartItem: async (req, res) => {
    const cartItemId = req.params.cartItemId;
    try {
      const updateCart = await Cart.findOneAndUpdate(
        {
          "products._id": cartItemId,
        },
        { $pull: { products: { _id: cartItemId } } },
        { new: true }
      );
      if (!updateCart) {
        return res.status(404).json("Không tìm thấy mục giỏ hàng");
      }
      res.status(200).json("Xóa sản phẩm khỏi giỏ hàng thành công");
    } catch (error) {
      res.status(500).json("Một số thứ đã xảy ra sai sót");
    }
  },

  // Hàm lấy số sản phẩm trong giỏ hàng
  getCartItemCount: async (req, res) => {
    const userId = req.params.userId;
    try {
      const cart = await Cart.findOne({ userId });
      let itemCount;
      if (!cart) {
        return res.status(200).json({ itemCount: 0 });
      }
      itemCount = cart.products.length;
      res.status(200).json({ itemCount });
    } catch (error) {
      res.status(500).json("Một số thứ đã xảy ra sai sót");
    }
  },

  // Hàm cập nhật số lượng sản phẩm trong giỏ hàng
  updateCartItemQuantity: async (req, res) => {
    const { cartItemId, newQuantity } = req.body;
    try {
      const cart = await Cart.findOne({ "products._id": cartItemId });
      if (!cart) {
        return res.json({ error: "Không tìm thấy mục giỏ hàng" });
      }
      const cartProduct = cart.products.find(
        (product) => product._id.toString() === cartItemId
      );
      if (!cartProduct) {
        return res.json({ error: "Không tìm thấy mục giỏ hàng" });
      }

      const product = await Product.findById(cartProduct.cartItem);
      if (!product) {
        return res.json({ error: "Sản phẩm không có" });
      }
      if (newQuantity > product.quantity) {
        return res.json({
          error: "Số lượng mới lớn hơn số lượng sản phẩm",
        });
      }
      cartProduct.quantity = newQuantity;
      await cart.save();
      return res.status(200).json("Cập nhật thành công");
    } catch (error) {
      res.status(500).json("Một số thứ đã xảy ra sai sót");
    }
  },
};
