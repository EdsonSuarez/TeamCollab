const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multiparty = require("connect-multiparty");
const multi = multiparty();
const fs = require("fs");
const path = require("path");
const moment = require("moment");
const Task = require("../models/task");
const DetailTask = require("../models/detailTask");
const User = require("../models/user");
const Auth = require("../middleware/auth");
const UserAuth = require("../middleware/user");
const Admin = require("../middleware/admin");
const ScrumM = require("../middleware/scrumMaster");
const Upload = require("../middleware/file");

router.post("/addTask", Auth, UserAuth, ScrumM, async (req, res) => {
  if (
    !req.body.name ||
    !req.body.description ||
    !req.body.boardId ||
    !req.body.priority
  )
    return res.status(401).send("Process failed: Incomplete data");
  const validId = mongoose.Types.ObjectId.isValid(req.body.boardId);
  if (!validId) return;
  if (req.body.dependency) {
    let isValid = mongoose.Types.ObjectId.isValid(req.body.dependency);
    if (!isValid)
      return res.status(401).send("Process failed: Invalid denpendencyId");
  }
  const task = new Task({
    name: req.body.name,
    description: req.body.description,
    boardId: req.body.boardId,
    duration: req.body.duration,
    dependency: req.body.dependency,
    status: "to-do",
    priority: req.body.priority,
  });
  try {
    const result = await task.save();
    if (!result)
      return res.status(401).send("Process failed: Error adding task");
    res.status(200).send({ result });
  } catch (e) {
    return res.status(401).send("Process failed: Error adding task");
  }
});

router.get("/getTaskUser", Auth, UserAuth, async (req, res) => {
  const userTask = await DetailTask.findById({ userId: req.user._id })
    .populate("taskId")
    .exc();
  if (!user) return res.status(401).send("Process failed: Task not found");
  res.status(200).send({ userTask });
});

router.get("getTaskScrum", Auth, UserAuth, ScrumM, async (req, res) => {
  const userTasks = await DetailTask.find().populate("taskId").exec();
  if (!userTasks)
    return res.status(401).send("Process failed: Tasks not found");
  res.status(200).send({ userTasks });
});

router.put("updateTask", Auth, UserAuth, ScrumM, async (req, res) => {
  if (
    !req.body._id ||
    !req.body.name ||
    !req.body.description ||
    !req.body.boardId ||
    !req.body.status ||
    !req.body.priority
  )
    return res.status(401).send("Process failed: Incomplete data");
  let validId = mongoose.Types.ObjectId.isValid(req.body._id);
  if (!validId) return res.status(401).send("Process failed: Invalid task Id");
  validId = mongoose.Types.ObjectId.isValid(req.body.boardId);
  if (!validId) return res.status(401).send("Process failed: Invalid boardId");
  if (req.body.dependency) {
    let isValid = mongoose.Types.ObjectId.isValid(req.body.dependency);
    if (!isValid)
      return res.status(401).send("Process failed: Invalid denpendencyId");
  }
  const task = Task.findById(req.body._id, {
    name: req.body.name,
    description: req.body.description,
    boardId: req.body.boardId,
    duration: req.body.duration,
    dependency: req.body.dependency,
    status: req.body.status,
    priority: req.body.priority,
  });
  if (!task) return res.status(401).send("Process failed: Error updating task");
  res.status(200).send({ task });
});

router.delete("deleteTask/:_id", Auth, UserAuth, ScrumM, async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params._id);
  if (!task) return res.status(401).send("Process failed: Error deleting task");
  res.status(200).send("Process successfull: Task deleted");
});

module.exports = router;
