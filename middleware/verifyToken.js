const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");

module.exports = (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res
      .status(403)
      .send({ verifiedUser: false, message: "No token provided!" });
  }
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .send({ verifiedUser: false, message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    req.userName = decoded.name;
    req.userEmail = decoded.email;
    next();
  });
};
