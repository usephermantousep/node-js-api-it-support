const router = require("express").Router();
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const verify = require("./verifyToken");
const bcrypt = require("bcryptjs");
const { registerValidation, loginValidation } = require("../validation");

router.get("/", async (req, res) => {
  //fetch all data
  const data = await User.find();
  res.send({
    status: "success",
    message: "all user fetched",
    data: data,
  });
});

//register
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
  const userRequest = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword,
  });

  try {
    const savedUser = await userRequest.save();
    res.status(200).send({
      status: "ok",
      message: "success insert data",
      data: savedUser,
    });
  } catch (err) {
    res.status(400).send({
      message: err,
    });
  }
});

//login
router.post("/login", async (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).send({
      status: "error",
      message: err,
    });
  }
});

//update
router.post("/update/:id", verify, async (req, res) => {
  let { ...data } = req.body;
  try {
    const user = await User.findByIdAndUpdate(req.params.id, data, {
      new: false,
    });
    console.log(user);

    const updated = await User.findById(req.params.id);
    res.send({
      status: "ok",
      message: "data updated",
      data: updated,
    });
  } catch (err) {
    res.status(400).send({
      status: "error",
      message: err,
    });
  }
});

//upload picture
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
