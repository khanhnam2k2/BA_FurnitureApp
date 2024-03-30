const categoryController = require("../controllers/categoryController");

const router = require("express").Router();
router.get("/", categoryController.getCategoryList);
router.post("/", categoryController.createCategory);

module.exports = router;
