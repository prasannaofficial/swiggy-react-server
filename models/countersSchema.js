const { Schema, model } = require("mongoose");

const countersSchema = new Schema({
  _id: String,
  sequence_value: Number,
});
var countersDetails = model("counters", countersSchema, "counters");

module.exports = countersDetails;
