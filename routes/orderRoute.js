const verifyToken = require("../middleware/verifyToken");
const Router = require("express").Router();
const orderController = require("../controllers/orderController");

Router.post("/api/placeorder", verifyToken, orderController.placeorder);
Router.get("/api/ordershistory", verifyToken, orderController.ordershistory);

module.exports = Router;
