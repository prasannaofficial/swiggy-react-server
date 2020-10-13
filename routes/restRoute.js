const router = require("express").Router();
const restController = require("../controllers/restController");
const verifyToken = require("../middleware/verifyToken");

router.get("/api/isloggedin", verifyToken, restController.isloggedin);
router.get("/api/restaurants", verifyToken, restController.restaurants);
router.get("/api/offers", verifyToken, restController.offers);
router.get("/api/restaurant/:id", verifyToken, restController.restaurant);

module.exports = router;
