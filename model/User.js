const mongoose = require("mongoose");

const options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

const userSchema = new mongoose.Schema({
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
  lineApproval: {
    type: Array,
    default: [],
  },
  area: {
    type: String,
    default: "",
  },
  divisi: {
    type: String,
    default: "",
  },
  imagePath: {
    type: String,
    default: "",
  },
  notifId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "USER",
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("User", userSchema);
