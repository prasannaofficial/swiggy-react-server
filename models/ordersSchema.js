const { ObjectID } = require("mongodb");
const { Schema, model } = require("mongoose");

const ordersSchema = new Schema({
  userid: ObjectID,
  date: {
    type: Date,
    default: Date.now,
  },
  restname: String,
  restarea: String,
  restimg: String,
  orders: Array,
  totalprice: String,
});
var ordersDetails = model("orders", ordersSchema, "orders");

module.exports = ordersDetails;
