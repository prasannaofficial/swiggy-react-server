const Razorpay = require("razorpay");
const uid = require("uid");
const axios = require("axios");
const Orders = require("../models/ordersSchema");
const { RAZORPAY_API_KEY, RAZORPAY_API_SECRET } = require("../config/keys");
const instance = new Razorpay({
  key_id: RAZORPAY_API_KEY,
  key_secret: RAZORPAY_API_SECRET,
});

exports.order = (req, res) => {
  try {
    const options = {
      amount: req.body.totalprice * 100,
      currency: "INR",
      receipt: "receipt#" + uid(16),
      payment_capture: 0,
    };
    instance.orders.create(options, async function (err, order) {
      if (err) {
        return res.status(500).json({
          message: "Something Went Wrong",
        });
      }
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
          return res.status(200).json({
            ...order,
            orderplaced: true,
            message: "Order Placed Successfully!!",
            data,
          });
        }
      });
    });
  } catch (err) {
    return res.status(500).json({
      message: "Something Went Wrong",
    });
  }
};

exports.capture = (req, res) => {
  try {
    console.log(req.body);
    const url = `https://${RAZORPAY_API_KEY}:${RAZORPAY_API_SECRET}@api.razorpay.com/v1/payments/${req.params.paymentId}/capture`;
    const data = { amount: req.body.totalprice * 100, currency: "INR" };
    axios
      .post(url, data)
      .then((response) => {
        const data = response.data;
        const { status, order_id } = data;
        Orders.find({ _id: req.body.swiggy_order_id }, (err, doc) => {
          Object.assign(doc[0], { is_success: true });
          doc[0].save((err) => {
            if (!err) {
              return res
                .status(200)
                .json({ status: status, order_id: order_id });
            }
          });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log("catch");
    return res.status(500).json({
      message: "Something Went Wrong out capture",
    });
  }
};
