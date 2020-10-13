const Orders = require("../models/ordersSchema");

const placeorder = (req, res) => {
  let newOrder = new Orders({
    userid: req.userId,
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
const ordershistory = (req, res) => {
  let { q, limit, offset, sort } = req.query;
  if (!q) {
    switch (sort) {
      case "new":
        Orders.find({ userid: req.userId })
          .sort({ date: -1 })
          .then((docs) => {
            let result = docs.slice(offset, offset + limit);
            res.json({ arr: result, verifiedUser: true, length: docs.length });
          });
        break;
      case "old":
        Orders.find({ userid: req.userId })
          .sort({ date: 1 })
          .then((docs) => {
            let result = docs.slice(offset, offset + limit);
            res.json({ arr: result, verifiedUser: true, length: docs.length });
          });
        break;
      case "asce":
        Orders.find({ userid: req.userId })
          .sort({ restname: 1 })
          .then((docs) => {
            let result = docs.slice(offset, offset + limit);
            res.json({ arr: result, verifiedUser: true, length: docs.length });
          });
        break;
      case "desc":
        Orders.find({ userid: req.userId })
          .sort({ restname: -1 })
          .then((docs) => {
            let result = docs.slice(offset, offset + limit);
            res.json({ arr: result, verifiedUser: true, length: docs.length });
          });
        break;
    }
  } else {
    Orders.find({
      userid: req.userId,
      restname: { $regex: new RegExp(".*" + q + ".*", "i") },
    }).then((docs) => {
      let result = docs.slice(offset, offset + limit);
      res.json({ arr: result, verifiedUser: true, length: docs.length });
    });
  }
};

module.exports = {
  placeorder,
  ordershistory,
};
