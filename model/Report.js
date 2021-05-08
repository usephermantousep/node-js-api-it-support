const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  tanggal: {
    type: Date,
    default: Date.now(),
  },
  judul: {
    type: String,
    require: true,
  },
  detail: {
    type: String,
    require: true,
  },
  statusIt: {
    type: String,
    default: "OPEN",
  },
  tanggalIt: {
    type: Date,
    default: Date.now(),
  },
  statusUser: {
    type: String,
    default: "OPEN",
  },
  action: {
    type: String,
    default: "-",
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

module.exports = mongoose.model("Report", reportSchema);
