const Product = require("../models/Products");
const Cart = require("../models/Cart");

module.exports = {
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
        res.status(200).json("Product added to cart");
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
        res.status(200).json("Product added to cart");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getCart: async (req, res) => {
    const userId = req.params.id;
    try {
      const cart = await Cart.find({ userId }).populate(
        "products.cartItem",
        "_id title supplier price imageUrl"
      );
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json(error);
    }
  },
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
        return res.status(404).json("Cart item not found");
      }
      res.status(200).json("Delete cart item successfully");
    } catch (error) {
      res.status(500).json(error);
    }
  },

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
      console.log(error);
    }
  },
  updateCartItemQuantity: async (req, res) => {
    const { cartItemId, newQuantity } = req.body;
    console.log("a", newQuantity);
    try {
      const cart = await Cart.findOne({ "products._id": cartItemId });
      if (!cart) {
        return res.json({ error: "Cart item not found" });
      }
      // tim va cap nhat so luong cart item trong gio hang
      const cartProduct = cart.products.find(
        (product) => product._id.toString() === cartItemId
      );
      if (!cartProduct) {
        return res.json({ error: "Cart item not found2" });
      }

      // lay thong tin san pham
      const product = await Product.findById(cartProduct.cartItem);
      if (!product) {
        return res.json({ error: "Product not found" });
      }
      if (newQuantity > product.quantity) {
        return res.json({
          error: "New quantity is greater than product's quantity",
        });
      }
      cartProduct.quantity = newQuantity;
      await cart.save();
      return res.status(200).json("Cart item quantity updated successfully");
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
