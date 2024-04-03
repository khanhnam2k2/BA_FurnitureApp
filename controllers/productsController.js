const Product = require("../models/Products");
const Category = require("../models/Category");
const User = require("../models/User");

module.exports = {
  // Hàm tạo mới sp
  createProduct: async (req, res) => {
    const newProduct = new Product(req.body);
    try {
      await newProduct.save();
      res.status(200).json("Sản phẩm được tạo thành công");
    } catch (error) {
      res.status(500).json("Một số thứ đã xảy ra sai sót");
    }
  },

  // Hàm lấy danh sách tất cả sp
  getAllProduct: async (req, res) => {
    try {
      const products = await Product.find()
        .populate("category")
        .sort({ createdAt: -1 });
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json("Một số thứ đã xảy ra sai sót");
    }
  },

  // Hàm lấy sản phẩm theo id
  getProduct: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id).populate(
        "category"
      );
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json("Một số thứ đã xảy ra sai sót");
    }
  },

  // Hàm tìm kiếm sp theo danh mục
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
      res.status(500).json("Một số thứ đã xảy ra sai sót");
    }
  },

  // Hàm tìm kiếm sp
  searchProduct: async (req, res) => {
    try {
      const searchKey = req.params.key;

      // Tìm kiếm theo tên sản phẩm, nhà cung cấp, hoặc tên category
      const products = await Product.find({
        $or: [
          { title: { $regex: searchKey, $options: "i" } }, // Tìm kiếm theo title
          { supplier: { $regex: searchKey, $options: "i" } }, // Tìm kiếm theo supplier
        ],
      });

      // Kiểm tra xem searchKey có phải là tên của category không
      const category = await Category.findOne({ name: searchKey });
      if (category) {
        // Nếu là tên của category, thêm sản phẩm thuộc category đó vào kết quả
        const productsInCategory = await Product.find({
          category: category._id,
        });
        products.push(...productsInCategory);
      }

      res.status(200).json(products);
    } catch (error) {
      res.status(500).json("Một số thứ đã xảy ra sai sót");
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
      res.status(500).json("Một số thứ đã xảy ra sai sót");
    }
  },
};
