const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("auth-token");
  if (!token)
    return res.status(400).send({
      status: "error",
      message: "Accsess Denied",
    });

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    req.status(400).send({
      status: "error",
      message: "Ivalid Token",
    });
  }
};
