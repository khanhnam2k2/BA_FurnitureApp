const Category = require("../models/Category");

module.exports = {
  // Hàm lấy danh sách danh mục sản phẩm
  getCategoryList: async (req, res) => {
    try {
      const categories = await Category.find();
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json("Một số thứ đã xảy ra sai sót");
    }
  },

  // Hàm tạo mới danh mục
  createCategory: async (req, res) => {
    try {
      const { name, description, icon } = req.body;

      const newCategory = new Category({
        name,
        description,
        icon,
      });

      const savedCategory = await newCategory.save();

      res.status(201).json(savedCategory);
    } catch (error) {
      res.status(500).json("Một số thứ đã xảy ra sai sót");
    }
  },
};
