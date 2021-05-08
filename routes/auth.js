const router = require("express").Router();
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const verify = require("./verifyToken");
const bcrypt = require("bcryptjs");
const { registerValidation, loginValidation } = require("../validation");

router.get("/", async (req, res) => {
  try {
    //fetch all data
    const data = await User.find();
    res.send({
      status: "success",
      message: "all user fetched",
      data: data,
    });
  } catch (err) {
    res.status(500).send({
      status: "error",
      message: err,
    });
  }
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
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    notifId: req.body.notifId,
    password: hashPassword,
  });

  try {
    const savedUser = await user.save();
    res.status(200).send({
      status: "success",
      message: "insert new user",
      data: savedUser,
    });
  } catch (err) {
    res.status(500).send({
      status: "error",
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

    const isActive = await User.findOne({
      email: req.body.email,
      isActive: true,
    });

    if (!isActive) {
      return res.status(400).send({
        status: "error",
        message: "account not activated",
      });
    }

    //creat a token
    const token = jwt.sign(
      { _id: user._id, isActive: user.isActive },
      process.env.TOKEN_SECRET
    );

    res.header("auth-token", token).status(200).send({
      status: "success",
      token: token,
      data: user,
    });
  } catch (err) {
    res.status(500).send({
      status: "error",
      message: err,
    });
  }
});

//update
router.post("/update/:id", verify, async (req, res) => {
  //compile data
  let { ...data } = req.body;
  try {
    //find user & update
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
    res.status(500).send({
      status: "error",
      message: err,
    });
  }
});

//delete
router.delete("/delete/:id", verify, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    res.send({
      status: "success",
      message: "user deleted",
      data: user,
    });
  } catch (err) {
    res.status(500).send({
      status: "error",
      message: err,
    });
  }
});

router.get("/activate/:id", async (req, res) => {
  try {
    //find user & update
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          isActive: true,
          updatedAt: Date.now(),
        },
      },
      {
        new: false,
      }
    );
    console.log(user);

    const active = await User.findById(req.params.id);
    res.send({
      status: "ok",
      message: "user activated",
      data: active,
    });
  } catch (err) {
    res.status(500).send({
      status: "error",
      message: err,
    });
  }
});

//upload picture
router.post("/photo", async (req, res) => {
  //handle auth token

  //handle image request
  if (!req.file) {
    return res.status(400).send({
      status: "error",
      message: "image must be uploaded",
    });
  }

  //update to user
  const updateUser = await User.findByIdAndUpdate(
    {
      _id: req.body.id,
    },
    {
      $set: {
        imagePath: req.file.path,
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
