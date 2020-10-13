const { Schema, model } = require("mongoose");
const offersSchema = new Schema({
  offers: Array,
});
var offerDetails = model("offers", offersSchema, "offers");
module.exports = offerDetails;
