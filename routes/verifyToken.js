const jwt = require("jsonwebtoken");
const User = require("../model/User");

module.exports = async function (req, res, next) {
  const token = req.header("auth-token");
  if (!token)
    return res.status(400).send({
      status: "error",
      message: "Accsess Denied",
    });

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    const valid = await User.findOne({
      _id: verified._id,
      isActive: verified.isActive,
    });
    if (!valid) {
      return res.status(400).send({
        status: "error",
        message: "Accsess Denied",
      });
    }
    next();
  } catch (err) {
    req.status(400).send({
      status: "error",
      message: "Ivalid Token",
    });
  }
};
