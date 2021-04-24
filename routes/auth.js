const router = require("express").Router();
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { registerValidation, loginValidation } = require("../validation");

router.post("/register", async (req, res) => {
  //Validate request
  const { error } = registerValidation(req.body);
  if (error)
    return res.status(400).send({
      status: "error",
      message: error.details[0].message,
    });

  //checking user in existing database
  const emailExist = await User.findOne({
    email: req.body.email,
  });

  if (emailExist)
    return res.status(400).send({
      status: "error",
      message: "email already taken",
    });

  //hash the password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  //insert user into database
  const user = new User({
    userName: req.body.userName,
    name: req.body.name,
    email: req.body.email,
    password: hashPassword,
  });

  try {
    const savedUser = await user.save();
    res.status(200).send({
      message: "success",
      data: savedUser,
    });
  } catch (err) {
    res.status(400).send({
      message: err,
    });
  }
});

router.get("/", async (req, res) => {
  const data = await User.find();
  res.send(data);
});

router.post("/login", async (req, res) => {
  //validation
  const { error } = loginValidation(req.body);
  if (error)
    return res.status(400).send({
      status: "error",
      message: error.details[0].message,
    });

  //checking user in existing database
  const user = await User.findOne({
    email: req.body.email,
  });

  if (!user)
    return res.status(400).send({
      status: "error",
      message: "email is not registered",
    });

  //if passord coorect
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass)
    return res.status(400).send({
      status: "error",
      message: "password is wrong",
    });

  //creat a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);

  res.header("auth-token", token).status(200).send({
    status: "success",
    token: token,
    data: user,
  });
});

module.exports = router;
