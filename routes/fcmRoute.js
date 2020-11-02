const verifyToken = require("../middleware/verifyToken");
const Router = require("express").Router();
const fcmController = require("../controllers/fcmController");

Router.post("/settoken", verifyToken, fcmController.settoken);

module.exports = Router;
