const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multiparty = require("connect-multiparty");
const multi = multiparty();
const fs = require("fs");
const path = require("path");
const moment = require("moment");
const Task = require("../models/task");
const Auth = require("../middleware/auth");
const UserAuth = require("../middleware/user");
const Admin = require("../middleware/admin");
const Upload = require("../middleware/file");

router.post("/addTask", Auth, UserAuth, async (req, res) => {
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
    const result = task.save();
    if (!result)
      return res.status(401).send("Process failed: Error adding task");
    res.status(200).send({ result });
  } catch (e) {
    return res.status(401).send("Process failed: Error adding task");
  }
});

module.exports = router;
