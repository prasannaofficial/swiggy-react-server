const Orders = require("../models/ordersSchema");
// const User = require("../models/userSchema");

const placeorder = (req, res) => {
  let newOrder = new Orders({
    userid: req.userId,
    is_success: true,
    restname: req.body.restname,
    restarea: req.body.area,
    restimg: req.body.imglink,
    orders: JSON.parse(req.body.ordersjson),
    totalprice: req.body.totalprice,
  });
  newOrder.save((err, data) => {
    if (!err) {
      res.json({ orderplaced: true, message: "Order Placed Successfully!!" });
    }
  });
};

const sendOrdersResponse = (offset, limit, res, orders) => {
  let result = orders.slice(offset, Number(offset) + Number(limit));
  res.json({
    arr: result,
    verifiedUser: true,
    length: orders.length,
  });
};

const ordershistory = (req, res) => {
  let { q, limit, offset, sort } = req.query;
  let sortObject = {};
  if (!q) {
    // let condition;
    // if (req.role === "admin") {
    //   condition = {};
    // } else {
    //   condition = {
    //     userid: req.userId,
    //   };
    // }
    switch (sort) {
      case "new":
        sortObject.date = -1;
        break;
      case "old":
        sortObject.date = 1;
      case "asce":
        sortObject.restname = 1;
        break;
      case "desc":
        sortObject.restname = -1;
        break;
    }
  }
  // else {
  //   Orders.find({
  //     ...condition,
  //     restname: { $regex: new RegExp(".*" + q + ".*", "i") },
  //   }).then((docs) => {
  //     let result = docs.slice(offset, Number(offset) + Number(limit));
  //     res.json({ arr: result, verifiedUser: true, length: docs.length });
  //   });
  // }
  if (req.role === "admin") {
    let aggregateArray = [];
    if (!q) {
      aggregateArray.push({
        $sort: {
          ...sortObject,
        },
      });
      aggregateArray.push({
        $match: {
          is_success: true,
        },
      });
    } else
      aggregateArray.push({
        $match: {
          restname: new RegExp(".*" + q + ".*", "i"),
          is_success: true,
        },
      });
    Orders.aggregate([
      ...aggregateArray,
      {
        $lookup: {
          from: "user",
          localField: "userid",
          foreignField: "_id",
          as: "userdetails",
        },
      },
    ]).exec((err, newOrders) =>
      sendOrdersResponse(offset, limit, res, newOrders)
    );
  } else {
    if (!q)
      Orders.find({ userid: req.userId, is_success: true })
        .sort(sortObject)
        .then((docs) => {
          sendOrdersResponse(offset, limit, res, docs);
        });
    else
      Orders.find({
        userid: req.userId,
        is_success: true,
        restname: { $regex: new RegExp(".*" + q + ".*", "i") },
      }).then((docs) => {
        sendOrdersResponse(offset, limit, res, docs);
      });
  }
};

module.exports = {
  placeorder,
  ordershistory,
};
