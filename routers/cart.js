const router = require("express").Router();
const cartController = require("../controllers/cartController");

router.get("/find/:id", cartController.getCart);
router.post("/addToCart", cartController.addToCart);
router.delete("/:cartItemId", cartController.deleteCartItem);
router.get("/:userId/cartItemCount", cartController.getCartItemCount);
router.get("/:userId/cartItemCount", cartController.getCartItemCount);
router.put("/updateQuantity", cartController.updateCartItemQuantity);

module.exports = router;
