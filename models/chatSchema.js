const { ObjectID } = require("mongodb");
const { Schema, model } = require("mongoose");

const chatSchema = new Schema({
  userid: ObjectID,
  date: {
    type: Date,
    default: Date.now,
  },
  message: String,
  role: String,
  email: String,
});
var chatDetails = model("chat", chatSchema, "chat");

module.exports = chatDetails;
