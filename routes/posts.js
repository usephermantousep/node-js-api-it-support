const router = require("express").Router();
const User = require("../model/User");
const verify = require("./verifyToken");

router.get("/", verify, async (req, res) => {
  const user = await User.find();
  res.json({
    Post: {
      title: "first post",
      description: "this description",
      author: user,
    },
  });
});

module.exports = router;
