const verifyToken = require("../middleware/verifyToken");
const router = require("express").Router();
const orderController = require("../controllers/orderController");

router.post("/api/placeorder", verifyToken, orderController.placeorder);
router.get("/api/ordershistory", verifyToken, orderController.ordershistory);

module.exports = router;
