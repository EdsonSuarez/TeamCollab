const mongoose = require("mongoose");

const detailTaskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.ObjectId, ref: "user" },
  taskId: { type: mongoose.Schema.ObjectId, ref: "task" },
  active: Boolean,
  date: { type: Date, default: Date.now },
});

const DetailTask = mongoose.model("detailTask", detailTaskSchema);
module.exports = DetailTask;
