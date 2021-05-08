const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const multer = require("multer");
const path = require("path");

//import Route
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const reportRoute = require("./routes/report");

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

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().getTime() + "-" + req.body.id + "-" + file.originalname
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

//Middleware
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Method",
//     "GET, PUT, POST, DELETE OPTIONS"
//   );
// });
//Router middleware
app.use("/api/user", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/report", reportRoute);
//default route
app.use("/", (req, res) => {
  res.status(404).send({
    status: "error",
    message: "NOT FOUND",
  });
});

app.listen(3000, () => {
  console.log("server is UP and RUNNING...");
});
