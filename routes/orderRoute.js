const verifyToken = require("../middleware/verifyToken");
const Router = require("express").Router();
const orderController = require("../controllers/orderController");
const isUser = require("../middleware/isUser");

Router.post("/api/placeorder", verifyToken, isUser, orderController.placeorder);
Router.get(
  "/api/ordershistory",
  verifyToken,
  isUser,
  orderController.ordershistory
);

module.exports = Router;
