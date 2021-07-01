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
const Auth = require("../middleware/auth");
const UserAuth = require("../middleware/user");
const ScrumM = require("../middleware/scrumMaster");
const Upload = require("../middleware/file");

router.post("/add", Auth, UserAuth, ScrumM, async (req, res) => {
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

router.post(
  "/addImg",
  multi,
  Upload,
  Auth,
  UserAuth,
  ScrumM,
  async (req, res) => {
    if (
      !req.body.name ||
      !req.body.description ||
      !req.body.boardId ||
      !req.body.priority
    )
      return res.status(401).send("Process failed: Incomplete data");
    const validId = mongoose.Types.ObjectId.isValid(req.body.boardId);
    if (!validId)
      return res.status(401).send("Process failed: Invalid boardId");
    let imageUrl = "";
    if (req.files !== undefined && req.files.image.type) {
      const url = req.protocol + "://" + req.get("host") + "/";
      // let serverImg =
      //   "./img/task/" + moment().unix() + path.extname(req.files.image.path);
      let serverImg =
        "./uploads/" + moment().unix() + path.extname(req.files.image.path);
      fs.createReadStream(req.files.image.path).pipe(
        fs.createWriteStream(serverImg)
      );
      imageUrl =
        // url + "img/" + moment().unix() + path.extname(req.files.image.path);
        url + "uploads/" + moment().unix() + path.extname(req.files.image.path);
    }
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
      imageUrl: imageUrl,
    });
    try {
      const result = await task.save();
      if (!result)
        return res.status(401).send("Process failed: Error adding task");
      res.status(200).send({ result });
    } catch (e) {
      return res.status(401).send("Process failed: Error adding task");
    }
  }
);

router.get("/get", Auth, UserAuth, async (req, res) => {
  const userTask = await DetailTask.find({ userId: req.user._id })
    .populate("taskId")
    .exec();
  res.status(200).send({ userTask });
});

router.get("/get/:_id",  async (req, res) => {
  const validId = mongoose.Types.ObjectId.isValid(req.params._id);
  if (!validId) return res.status(401).send("Process failed: Invalid id");
  const userTask = await Task.findById(req.params._id)
    // .populate("taskId")
    // .exec();
  res.status(200).send({ userTask });
});

router.get("/getScrum/:userId?", Auth, UserAuth, ScrumM, async (req, res) => {
  const userTasks = await DetailTask.find({ userId: req.params.userId })
    .populate("taskId")
    .exec();
  if (!userTasks)
    return res.status(401).send("Process failed: Tasks not found");
  res.status(200).send({ userTasks });
});

router.put("/update", Auth, UserAuth, ScrumM, async (req, res) => {
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
  const task = await Task.findByIdAndUpdate(req.body._id, {
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

router.delete("/delete/:_id", Auth, UserAuth, async (req, res) => {
  const validId = mongoose.Types.ObjectId.isValid(req.params._id);
  if (!validId) return res.status(401).send("Process failed: Invalid id");

  const detailTask = await DetailTask.deleteMany({ taskId: req.params._id });
  if (!detailTask)
    return res.status(401).send("Process failed: DetailTask not found");

  const task = await Task.findByIdAndDelete(req.params._id);
  if (!task) return res.status(401).send("Process failed: Error deleting task");
  res.status(200).send("Process successfull: Task deleted");
});

module.exports = router;
