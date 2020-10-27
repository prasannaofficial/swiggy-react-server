const User = require("../models/userSchema");

const userslist = (req, res) => {
  User.find({ role: "user" }).then((result) => {
    let data = {
      verifiedUser: true,
      users: result.map((el) => {
        return {
          name: el.name,
          email: el.email,
        };
      }),
    };
    res.status(200).send(data);
  });
};

module.exports = {
  userslist,
};
