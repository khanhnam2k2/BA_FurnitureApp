const router = require("express").Router();

const productController = require("../controllers/productsController");

router.get("/", productController.getAllProduct);
router.get("/:id", productController.getProduct);
router.get("/category/:categoryId", productController.searchProductByCategory);
router.get("/search/:key", productController.searchProduct);
router.post("/", productController.createProduct);
router.post("/:id/favorites", productController.toggleFavorite);

module.exports = router;
