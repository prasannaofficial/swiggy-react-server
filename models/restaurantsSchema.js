const { Schema, model } = require("mongoose");

const restaurantsSchema = new Schema({
  id: String,
  name: String,
  city: String,
  imgLink: String,
  locality: String,
  area: String,
  cuisines: Array,
  avgRating: String,
  noOfRating: Number,
  duration: String,
  costForTwoString: String,
  shortDiscount: String,
  discount: String,
  veg: Boolean,
  menuCategory: Array,
  recommended: Array,
  others: Object,
});
var restDetails = model("restaurants", restaurantsSchema, "restaurants");

module.exports = restDetails;
