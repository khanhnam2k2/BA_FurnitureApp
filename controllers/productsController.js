const Product = require("../models/Products");
const User = require("../models/User");
module.exports = {
  createProduct: async (req, res) => {
    const newProduct = new Product(req.body);
    try {
      await newProduct.save();
      res.status(200).json("Product created successfully");
    } catch (error) {
      res.status(500).json("Failed to create Product");
    }
  },

  getAllProduct: async (req, res) => {
    try {
      const products = await Product.find()
        .populate("category")
        .sort({ createdAt: -1 });
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json("Failed to get products");
    }
  },

  getProduct: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id).populate(
        "category"
      );
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json("Failed to get product");
    }
  },
  searchProductByCategory: async (req, res) => {
    const categoryId = req.params.categoryId;
    try {
      let products;
      if (!categoryId) {
        products = await Product.find();
      } else {
        // Tìm kiếm các sản phẩm thuộc về category được chỉ định
        products = await Product.find({ category: categoryId });
      }

      res.status(200).json(products);
    } catch (error) {
      console.log(error);
      res.status(500).json("Failed to get products by category");
    }
  },

  searchProduct: async (req, res) => {
    try {
      // Chuyển đổi query và dữ liệu trong cơ sở dữ liệu thành chữ thường
      const lowerCaseQuery = req.params.key.toLowerCase();

      const result = await Product.aggregate([
        {
          $search: {
            index: "furniture",
            text: {
              query: lowerCaseQuery, // Sử dụng query đã chuyển đổi thành chữ thường
              path: ["title", "supplier", "product_location", "price"],
              fuzzy: {
                maxEdits: 2,
                prefixLength: 1,
              },
            },
          },
        },
      ]);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json("Failed to get product");
    }
  },
  toggleFavorite: async (req, res) => {
    const productId = req.params.id;
    const userId = req.body.userId;
    let checkIsFavorites;
    try {
      // Tìm người dùng và sản phẩm tương ứng
      const user = await User.findById(userId);
      const product = await Product.findById(productId);

      // Kiểm tra xem sản phẩm đã được yêu thích bởi người dùng chưa
      const isProductFavorited = user.favoriteProducts.includes(productId);

      if (!isProductFavorited) {
        // Nếu chưa, thêm sản phẩm vào danh sách yêu thích của người dùng
        user.favoriteProducts.push(productId);
        await user.save();

        // Tăng số lượt yêu thích của sản phẩm và thêm người dùng vào danh sách favoriteBy
        product.favoriteCount++;
        product.favoriteBy.push(userId);
        await product.save();
        checkIsFavorites = true;
        res.status(200).json(checkIsFavorites);
      } else {
        // Nếu sản phẩm đã tồn tại trong danh sách yêu thích của người dùng, hãy loại bỏ nó
        user.favoriteProducts.pull(productId);
        await user.save();

        // Giảm số lượt yêu thích của sản phẩm và loại bỏ người dùng khỏi danh sách favoriteBy
        product.favoriteCount--;
        product.favoriteBy.pull(userId);
        await product.save();
        checkIsFavorites = false;
        res.status(200).json(checkIsFavorites);
      }
    } catch (error) {
      res.status(500).json("Failed to toggle favorite product");
    }
  },
};
