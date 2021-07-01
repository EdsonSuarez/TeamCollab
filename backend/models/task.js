const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  name: String,
  description: String,
  boardId: { type: mongoose.Schema.ObjectId, ref: "board" },
  duration: { type: Date, default: Date.UTC(0, 0, 0, 1, 0, 0, 0) },
  dependency: { type: mongoose.Schema.ObjectId },
  status: String,
  priority: { type: String, default: "1" },
  imageUrl: String, 
  imageName: String,
  date: { type: Date, default: Date.now },
});

const task = mongoose.model("task", taskSchema);

module.exports = task;
