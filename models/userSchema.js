const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  name: String,
  email: String,
  password: String,
  fcmtoken: String,
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});
var userDetails = model("user", userSchema, "user");

module.exports = userDetails;
