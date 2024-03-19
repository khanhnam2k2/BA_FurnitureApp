const router = require("express").Router();
const cartController = require("../controllers/cartController");

router.get("/find/:id", cartController.getCart);
router.post("/addToCart", cartController.addToCart);
router.post("/quantity", cartController.decrementCartItem);
router.delete("/:cartItemId", cartController.deleteCartItem);
router.get("/:userId/cartItemCount", cartController.getCartItemCount);

module.exports = router;
