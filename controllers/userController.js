const Products = require("../models/Products");
const User = require("../models/User");

module.exports = {
  deleteUser: async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);

      res.status(200).json("Successfully deleted");
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(401).json("User does not exist");
      }
      const { password, __v, createdAt, updatedAt, ...userData } = user._doc;

      res.status(200).json(userData);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getUserFavorites: async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await User.findById(userId).populate("favoriteProducts");
      res.status(200).json(user.favoriteProducts);
    } catch (error) {
      console.error(error);
      res.status(500).json("Failed to get user favorites");
    }
  },
  removeFromFavorites: async (req, res) => {
    const userId = req.params.userId;
    const productId = req.params.productId;
    try {
      const user = await User.findById(userId);
      const product = await Products.findById(productId);
      if (!user || !product) {
        return res.status(404).json("User or product not found");
      }
      const index = user.favoriteProducts.indexOf(productId);
      if (index !== -1) {
        user.favoriteProducts.splice(index, 1);
        await user.save();

        // Giảm số lượt yêu thích của sản phẩm và xóa người dùng khỏi danh sách favoriteBy
        product.favoriteCount--;
        const userIndex = product.favoriteBy.indexOf(userId);
        if (userIndex !== -1) {
          product.favoriteBy.splice(userIndex, 1);
        }
        await product.save();

        res.status(200).json("Product removed from favorites");
      } else {
        res.status(400).json("Product is not in favorites");
      }
    } catch (error) {
      res.status(500).json("Failed to remove product from favorites");
    }
  },
  updateUserProfile: async (req, res) => {
    const userId = req.params.id;
    const { username, location, avatar } = req.body;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.json({ error: "User not found" });
      }

      // Cập nhật thông tin hồ sơ nếu được cung cấp
      if (username) {
        user.username = username;
      }
      if (location) {
        user.location = location;
      }
      if (avatar) {
        user.avatar = avatar;
      }

      // Lưu lại thay đổi
      await user.save();

      res.status(200).json("Profile updated successfully");
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
