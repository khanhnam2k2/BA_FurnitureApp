const Category = require("../models/Category");

module.exports = {
  getCategoryList: async (req, res) => {
    try {
      const categories = await Category.find();
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json("Some things went wrong");
    }
  },
  createCategory: async (req, res) => {
    try {
      // Lấy thông tin của category từ request body
      const { name, description, icon } = req.body;

      // Tạo một đối tượng Category mới
      const newCategory = new Category({
        name,
        description,
        icon,
      });

      // Lưu category mới vào cơ sở dữ liệu
      const savedCategory = await newCategory.save();

      // Trả về category vừa được tạo thành công trong JSON response
      res.status(201).json(savedCategory);
    } catch (error) {
      // Xử lý lỗi nếu có
      res.status(500).json({ message: error.message });
    }
  },
};
