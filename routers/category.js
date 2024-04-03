const router = require("express").Router();
const categoryController = require("../controllers/categoryController");

router.get("/", categoryController.getCategoryList);
router.post("/", categoryController.createCategory);

module.exports = router;
