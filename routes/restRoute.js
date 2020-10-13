const Router = require("express").Router();
const restController = require("../controllers/restController");
const verifyToken = require("../middleware/verifyToken");

Router.get("/api/isloggedin", verifyToken, restController.isloggedin);
Router.get("/api/restaurants", verifyToken, restController.restaurants);
Router.get("/api/offers", verifyToken, restController.offers);
Router.get("/api/restaurant/:id", verifyToken, restController.restaurant);

module.exports = Router;
