const router = require("express").Router();
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const verify = require("./verifyToken");
const bcrypt = require("bcryptjs");
const { registerValidation, loginValidation } = require("../validation");
const RequestUserAccount = require("../model/RequestUserAccount");

router.post("/register", async (req, res) => {
  //Validate request
  const { error } = registerValidation(req.body);
  if (error)
    return res.status(400).send({
      status: "error",
      message: error.details[0].message,
    });

  //checking user in existing database
  const emailExist = await RequestUserAccount.findOne({
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
  const userRequest = new RequestUserAccount({
    userName: req.body.userName,
    name: req.body.name,
    email: req.body.email,
    password: hashPassword,
  });

  try {
    const savedUser = await userRequest.save();
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

router.get("/requestaccount", async (req, res) => {
  const data = await RequestUserAccount.find();
  res.status(200).send(data);
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

router.post("/photo", verify, async (req, res) => {
  //handle auth token

  //handle image request

  //upload to folder images

  //update to user
  const updateUser = User.findByIdAndUpdate(
    {
      _id: req.body.id,
    },
    {
      update: {
        $set: {
          imagePath: "imagePath",
        },
      },
    }
  );

  //response
  res.status(200).send({
    status: "success",
    message: "image uploaded",
    data: {
      updateUser,
    },
  });
});

module.exports = router;
