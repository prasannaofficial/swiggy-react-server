const verifyToken = require("../middleware/verifyToken");
const Router = require("express").Router();
const paymentController = require("../controllers/paymentController");
const isUser = require("../middleware/isUser");

Router.post("/order", verifyToken, isUser, paymentController.order);
Router.post("/capture/:paymentId", paymentController.capture);

module.exports = Router;
