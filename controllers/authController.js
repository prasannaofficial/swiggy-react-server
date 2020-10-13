const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { JWT_SECRET } = require("../config/keys");

const saltRounds = 8;

const signup = (req, res) => {
  User.findOne({ email: req.body.email }, (err, oldUser) => {
    if (oldUser) {
      res.json({
        userInserted: false,
        message: "Email ID already exists please try login!!",
      });
    } else {
      bcrypt.hash(req.body.password, saltRounds).then(function (hash) {
        let newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: hash,
        });
        newUser.save(function (err, data) {
          if (!err) {
            var token = jwt.sign(
              { id: data._id, name: data.name, email: data.email },
              JWT_SECRET,
              {
                expiresIn: 86400, // 24 hours
              }
            );
            res.json({
              userInserted: true,
              message: "Account created successfully",
              token: token,
            });
          }
        });
      });
    }
  });
};
const login = (req, res) => {
  User.findOne({ email: req.body.email }, (err, data) => {
    if (data) {
      bcrypt.compare(req.body.password, data.password).then(function (result) {
        if (result) {
          var token = jwt.sign(
            { id: data._id, name: data.name, email: data.email },
            JWT_SECRET,
            {
              expiresIn: 86400, // 24 hours
            }
          );
          res.json({
            loggedin: true,
            message: "user loggedin successfully",
            token: token,
          });
        } else {
          res.json({
            loggedin: false,
            message: "Incorrect Email ID or Password!!",
          });
        }
      });
    } else {
      res.json({
        loggedin: false,
        message: "Incorrect Email ID or Password!!",
      });
    }
  });
};

module.exports = {
  signup,
  login,
};
