const { ObjectID } = require("mongodb");
const { Schema, model } = require("mongoose");

const ordersSchema = new Schema({
  userid: ObjectID,
  date: {
    type: Date,
    default: Date.now,
  },
  is_success: {
    type: Boolean,
    default: false,
  },
  restname: String,
  restarea: String,
  restimg: String,
  orders: Array,
  totalprice: String,
});
var ordersDetails = model("orders", ordersSchema, "orders");

module.exports = ordersDetails;
