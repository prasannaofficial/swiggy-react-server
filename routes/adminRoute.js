const verifyToken = require("../middleware/verifyToken");
const Router = require("express").Router();
const isAdmin = require("../middleware/isAdmin");
const orderController = require("../controllers/orderController");
const restController = require("../controllers/restController");
const adminController = require("../controllers/adminController");

// const adminController = require("../controllers/adminController");
// Router.get(
//   "/restaurant/:restid",
//   verifyToken,
//   isAdmin,
//   adminController.getRestaurant
// );
// Router.post(
//   "/restaurant",
//   verifyToken,
//   isAdmin,
//   adminController.postRestaurant
// );
// Router.put(
//   "/restaurant/:restid",
//   verifyToken,
//   isAdmin,
//   adminController.putRestaurant
// );
// Router.delete(
//   "/restaurant/:restid",
//   verifyToken,
//   isAdmin,
//   adminController.deleteRestaurant
// );

// Router.get(
//   "/restaurant/:restid/menuitem/:itemid",
//   verifyToken,
//   isAdmin,
//   adminController.getRestaurantItem
// );
// Router.post(
//   "/restaurant/:restid/menuitem",
//   verifyToken,
//   isAdmin,
//   adminController.postRestaurantItem
// );
// Router.put(
//   "/restaurant/:restid/menuitem/:itemid",
//   verifyToken,
//   isAdmin,
//   adminController.putRestaurantItem
// );
// Router.delete(
//   "/restaurant/:restid/menuitem/:itemid",
//   verifyToken,
//   isAdmin,
//   adminController.deleteRestaurantItem
// );
Router.get(
  "/ordershistory",
  verifyToken,
  isAdmin,
  orderController.ordershistory
);
Router.get("/isloggedin", verifyToken, restController.isloggedin);
Router.get("/userslist", verifyToken, adminController.userslist);

module.exports = Router;
