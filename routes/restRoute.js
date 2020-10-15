const Router = require("express").Router();
const restController = require("../controllers/restController");
const verifyToken = require("../middleware/verifyToken");
const isUser = require("../middleware/isUser");

Router.get("/api/isloggedin", verifyToken, restController.isloggedin);
Router.get("/api/restaurants", verifyToken, isUser, restController.restaurants);
Router.get("/api/offers", verifyToken, isUser, restController.offers);
Router.get(
  "/api/restaurant/:id",
  verifyToken,
  isUser,
  restController.restaurant
);

module.exports = Router;
