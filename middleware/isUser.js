module.exports = (req, res, next) => {
  if (req.role === "user") {
    next();
  } else {
    return res
      .status(403)
      .send({ verifiedUser: false, message: "Please login from right portal" });
  }
};
