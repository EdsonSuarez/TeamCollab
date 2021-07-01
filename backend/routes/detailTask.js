const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const DetailTask = require("../models/detailTask");

const Auth = require("../middleware/auth");
const UserAuth = require("../middleware/user");
const TeachnicalAuth = require("../middleware/technicalLeader");

router.post("/add", Auth, UserAuth, TeachnicalAuth, async (req, res) => {
  if (
    !req.body.userId ||
    !req.body.taskId 
  )
    return res.status(400).send("Process failed: Incomplete data");

  const validUserId = mongoose.Types.ObjectId.isValid(req.body.userId);
  const validTaskId = mongoose.Types.ObjectId.isValid(req.body.taskId);
  if (!validUserId || !validTaskId) return res.status(401).send("Process failed: Invalid id");


  detailTask = new DetailTask({
    userId: req.body.userId,
    taskId: req.body.taskId,
    active: true,
  });

  const result = await detailTask.save();
  if (!result)
    return res.status(401).send("Process failed: Failed to register task");
  return res.status(200).send({ result });
});

router.get("/get", Auth, UserAuth, TeachnicalAuth, async (req, res) => {
  const detailTask = await DetailTask.find();
  if (!detailTask) return res.status(401).send("Process failed: No DetailTasks to delete");
  return res.status(200).send({ detailTask });
});

router.get("/getUsers/:_id?", Auth, UserAuth, async (req, res) => {
  const users = await DetailTask.find({ taskId: req.params._id})
  .populate("userId")
  .exec();
  if (!users) return res.status(401).send("Process failed: No DetailTasks to delete");
  return res.status(200).send({ users });
});

router.put("/update", Auth, UserAuth, TeachnicalAuth, async (req, res) => {
    if (
        !req.body._id ||
        !req.body.userId ||
        !req.body.taskId
      )
        return res.status(400).send("Process failed: Incomplete data");
    
  const validUserId = mongoose.Types.ObjectId.isValid(req.body.userId);
  const validTaskId = mongoose.Types.ObjectId.isValid(req.body.taskId);
  if (!validUserId || !validTaskId) return res.status(401).send("Process failed: Invalid id");

  const detailTask = await DetailTask.findByIdAndUpdate(req.body._id, {
    userId: req.user._id,
    taskId: req.body.taskId,
    status: req.body.status,
  });
  if (!detailTask) return res.status(401).send("Process failed: DetailTask not found");
  return res.status(200).send({ detailTask });
});

router.delete("/delete/:_id", Auth, UserAuth, TeachnicalAuth, async (req, res) => {
  const validId = mongoose.Types.ObjectId.isValid(req.params._id);
  if (!validId) return res.status(401).send("Process failed: Invalid id");

  const detailTask = await DetailTask.findByIdAndDelete(req.params._id);
  if (!detailTask) return res.status(401).send("Process failed: DetailTask not found");
  return res.status(200).send("DetailTask deleted");
});

module.exports = router;
