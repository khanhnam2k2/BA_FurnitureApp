const Products = require("../models/Products");
const User = require("../models/User");

module.exports = {
  // Hàm xóa tk user
  deleteUser: async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);

      res.status(200).json("Xóa tài khoản thành công");
    } catch (error) {
      res.status(500).json("Một số thứ đã xảy ra sai sót");
    }
  },

  // Hàm lấy thông tin user theo id
  getUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(401).json("Người dùng không tồn tại");
      }
      const { password, __v, createdAt, updatedAt, ...userData } = user._doc;

      res.status(200).json(userData);
    } catch (error) {
      res.status(500).json("Một số thứ đã xảy ra sai sót");
    }
  },

  // Hàm lấy sp mà user đã yêu thíc
  getUserFavorites: async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await User.findById(userId).populate("favoriteProducts");
      res.status(200).json(user.favoriteProducts);
    } catch (error) {
      res.status(500).json("Một số thứ đã xảy ra sai sót");
    }
  },

  // Hàm xóa sản phẩm yêu thích
  removeFromFavorites: async (req, res) => {
    const userId = req.params.userId;
    const productId = req.params.productId;
    try {
      const user = await User.findById(userId);
      const product = await Products.findById(productId);
      if (!user || !product) {
        return res.status(404).json("Không tìm thấy người dùng hoặc sản phẩm");
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

        res.status(200).json("Sản phẩm đã bị xóa khỏi mục yêu thích");
      } else {
        res.status(400).json("Sản phẩm không có trong mục yêu thích");
      }
    } catch (error) {
      res.status(500).json("Một số thứ đã xảy ra sai sót");
    }
  },

  // Hàm cập nhật profile user
  updateUserProfile: async (req, res) => {
    const userId = req.params.id;
    const { username, location, avatar } = req.body;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.json({ error: "Không tìm thấy người dùng" });
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

      res.status(200).json("Hồ sơ được cập nhật thành công");
    } catch (error) {
      res.status(500).json("Một số thứ đã xảy ra sai sót");
    }
  },
};
