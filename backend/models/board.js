const mongoose = require("mongoose");

const boardSchema = mongoose.Schema({
  name: String,
  description: String,
  teamId: { type: mongoose.Schema.ObjectId, ref: "team" },
  status: { type: String, default: "to-do" },
  active: { type: Boolean, default: true },
  date: { type: Date, default: Date.now },
});

const Board = mongoose.model("board", boardSchema);

module.exports = Board;