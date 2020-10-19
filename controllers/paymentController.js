const Razorpay = require("razorpay");
const uid = require("uid");
const axios = require("axios");
const { RAZORPAY_API_KEY, RAZORPAY_API_SECRET } = require("../config/keys");
const instance = new Razorpay({
  key_id: RAZORPAY_API_KEY,
  key_secret: RAZORPAY_API_SECRET,
});

exports.order = (req, res) => {
  try {
    // console.log(req.body);
    const options = {
      amount: req.body.totalprice * 100,
      // amount: 100,
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
      // console.log("success", order);
      return res.status(200).json(order);
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
        console.log(response.data);
        const { status, order_id } = data;
        return res.status(200).json({ status: status, order_id: order_id });
      })
      .catch((err) => {
        console.log("try catch");
        console.log(err);
      });
  } catch (err) {
    console.log("catch");
    console.log(err);
    return res.status(500).json({
      message: "Something Went Wrong out capture",
    });
  }
  // try {
  //   return request(
  //     {
  //       method: "POST",
  //       url: `https://${RAZORPAY_API_KEY}:${RAZORPAY_API_SECRET}@api.razorpay.com/v1/payments/${req.body.paymentId}/capture`,
  //       form: {
  //         amount: req.body.totalprice * 100,
  //         currency: "INR",
  //       },
  //     },
  //     async function (err, response, body) {
  //       if (err) {
  //         console.log("try", err);
  //         return res.status(500).json({
  //           message: "Something Went Wrong",
  //           err: err,
  //         });
  //       }
  //       return res.status(200).json(body);
  //     }
  //   );
  // } catch (err) {
  //   console.log("catch", err);
  //   return res.status(500).json({
  //     message: "Something Went Wrong",
  //     err: err,
  //   });
  // }
};
