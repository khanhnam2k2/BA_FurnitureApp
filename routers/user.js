const router = require("express").Router();
const userController = require("../controllers/userController");

router.delete("/:id", userController.deleteUser);
router.get("/:id", userController.getUser);
router.get("/:userId/favorites", userController.getUserFavorites);
router.delete(
  "/:userId/product/:productId",
  userController.removeFromFavorites
);
module.exports = router;
