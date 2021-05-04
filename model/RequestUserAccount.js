const mongoose = require("mongoose");

const options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

const requestUserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    min: 4,
    max: 255,
  },
  name: {
    type: String,
    required: true,
    min: 3,
    max: 255,
  },
  email: {
    type: String,
    required: true,
    max: 255,
    min: 6,
  },
  password: {
    type: String,
    required: true,
    max: 255,
    min: 6,
  },
  line_approval: {
    type: Array,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("RequestUserAccount", requestUserSchema);