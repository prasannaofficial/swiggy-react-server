const User = require("../models/userSchema");

const settoken = (req, res) => {
  User.find({ email: req.userEmail }, (err, doc) => {
    Object.assign(doc[0], { fcmtoken: req.body.fcmtoken });
    doc[0].save((err) => {
      if (!err) {
        return res.status(200).json({ success: true });
      }
    });
  });
};
module.exports = {
  settoken,
};
