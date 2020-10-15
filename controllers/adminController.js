const Restaurants = require("../models/restaurantsSchema");
const Counter = require("../models/countersSchema");

const getRestaurant = (req, res) => {
  Restaurants.find({ id: req.params.restid }, (err, docs) => {
    res.status(200).send(docs[0]);
  });
};
const postRestaurant = (req, res) => {
  Counter.findById("restid", (err, doc) => {
    let updated = {
      _id: "restid",
      sequence_value: doc.sequence_value + 1,
    };
    Object.assign(doc, updated);
    doc.save((err) => {
      if (!err) {
        let newRestaurant = new Restaurants({
          id: doc.sequence_value,
          ...JSON.parse(req.body.restdetails),
        });
        newRestaurant.save((err, data) => {
          if (!err) {
            res.json({
              restaurantadded: true,
              message: "Restaurant added Successfully!!",
            });
          }
        });
      }
    });
  });
};
const putRestaurant = (req, res) => {
  Restaurants.find({ id: req.params.restid }, (err, doc) => {
    Object.assign(doc[0], JSON.parse(req.body.restdetails));
    doc[0].save((err) => {
      if (!err) {
        res.json({
          restaurantupdated: true,
          message: "Restaurant updated Successfully!!",
        });
      }
    });
  });
};
const deleteRestaurant = (req, res) => {
  Restaurants.deleteOne({ id: req.params.restid }, (err) => {
    if (!err) {
      res.json({
        restaurantdeleted: true,
        message: "Restaurant deleted Successfully!!",
      });
    }
  });
};
const getRestaurantItem = (req, res) => {
  Restaurants.findOne({ id: req.params.restid }, (err, doc) => {
    if (!err) {
      for (item of doc.recommended) {
        if (item.id == req.params.itemid) {
          res.json(item);
        }
      }
    }
  });
};
const postRestaurantItem = (req, res) => {};
const putRestaurantItem = (req, res) => {};
const deleteRestaurantItem = (req, res) => {};

module.exports = {
  getRestaurant,
  postRestaurant,
  putRestaurant,
  deleteRestaurant,
  getRestaurantItem,
  postRestaurantItem,
  putRestaurantItem,
  deleteRestaurantItem,
};
