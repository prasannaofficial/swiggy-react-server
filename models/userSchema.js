const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  name: String,
  email: String,
  password: String,
});
var userDetails = model("user", userSchema, "user");

module.exports = userDetails;
