const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");

//import Route
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

dotenv.config();

//connect DB
mongoose.connect(
  process.env.DB_CONNECT,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("connect to DB localhost");
  }
);

//Middleware
app.use(express.json());
//Router middleware
app.use("/api/user", authRoute);
app.use("/api/posts", postRoute);
app.use("/", (req, res) => {
  res.status(404).send({
    status: "error",
    message: "NOT FOUND",
  });
});

app.listen(3000, () => {
  console.log("server is UP and RUNNING...");
});
