const router = require("express").Router();
const orderController = require("../controllers/orderController");

router.get("/:id", orderController.getUserOrders);
router.post("/", orderController.createOrder);

module.exports = router;
