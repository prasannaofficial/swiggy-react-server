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
// const restaurantSchema = mongoose.Schema({
//   id: {
//     type: String,
//     required: true,
//   },
//   name: {
//     type: String,
//     required: true,
//   },
//   city: {
//     type: String,
//     required: true,
//   },
//   imgLink: {
//     type: String,
//     required: true,
//   },
//   locality: {
//     type: String,
//     required: true,
//   },
//   area: {
//     type: String,
//     required: true,
//   },
//   avgRating: {
//     type: String,
//     required: true,
//   },
//   duration: {
//     type: String,
//     required: true,
//   },
//   costForTwoString: {
//     type: String,
//     required: true,
//   },
//   shortDiscount: {
//     type: String,
//     required: true,
//   },
//   discount: {
//     type: String,
//     required: true,
//   },
//   noOfRating: {
//     type: Number,
//     required: true,
//   },
//   cuisines: [
//     {
//       type: String,
//     },
//   ],
//   veg: {
//     type: Boolean,
//   },
//   menuCategory: [
//     {
//       type: String,
//     },
//   ],
//   recommended: [
//     {
//       id: { type: Number },
//       name: { type: String },
//       imgId: { type: String },
//       imgLink: { type: String },
//       priceString: { type: String },
//       price: { type: Number },
//     },
//   ],
// });
var restDetails = model("restaurants", restaurantsSchema, "restaurants");
module.exports = restDetails;
