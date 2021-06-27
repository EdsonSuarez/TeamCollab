const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Board = require("../models/board");
const Team = require("../models/team");
const Auth = require("../middleware/auth");
const ScrumMaster = require("../middleware/scrumMaster");
const detailTask = require("../models/detailTask");
const UserAuth = require("../middleware/user");

router.post("/add", Auth, ScrumMaster, async (req, res) => {
  if (!req.body.name || !req.body.description || !req.body.teamId)
    return res.status(401).send("Process failed: Incomplete data");

  const validId = mongoose.Types.ObjectId.isValid(req.body.teamId);
  if (!validId) return res.status(401).send("Process failed: Invalid id");

  const exist = await Team.findById(req.body.teamId);
  if (!exist) return res.status(401).send("Process failed: team doesn't exist");

  const board = new Board({
    name: req.body.name,
    description: req.body.description,
    teamId: req.body.teamId,
  });

  const result = await board.save();
  if (!result)
    return res.status(401).send("Process failed: Failed to register board");
  return res.status(200).send({ result });
});

router.get("/get/:name?", Auth, ScrumMaster, async (req, res) => {
  const board = await Board.find({ name: new RegExp(req.params["name"], "i") })
    .populate("teamId")
    .exec();
  if (!board) return res.status(401).send("Error fetching user information");
  return res.status(200).send({ board });
});

router.get("/getBoardUser", Auth, UserAuth, async (req, res) => {
  
  const tasksUser = await detailTask.find({userId: req.user._id})
  .populate({path:'taskId', populate:{path:'boardId', populate:{path:'teamId', populate:{path:'projectId'}}}})
  .exec();
  if (!tasksUser) return res.status(401).send("Error fetching tasks user");
  return res.status(200).send({ tasksUser });
});

router.put("/update", Auth, ScrumMaster, async (req, res) => {
  if (
    !req.body._id ||
    !req.body.name ||
    !req.body.description ||
    !req.body.teamId
  )
    return res.status(401).send("Process failed: Incomplete data");

  const validId = mongoose.Types.ObjectId.isValid(req.body.teamId);
  if (!validId) return res.status(401).send("Process failed: Invalid id");

  const exist = await Team.findById(req.body.teamId);
  if (!exist) return res.status(401).send("Process failed: team doesn't exist");

  const board = await Board.findByIdAndUpdate(req.body._id, {
    name: req.body.name,
    description: req.body.description,
    teamId: req.body.teamId,
  });
  if (!board) return res.status(401).send("Process failed: board not found");
  return res.status(200).send({ board });
});

router.put("/delete", Auth, ScrumMaster, async (req, res) => {
  if (
    !req.body._id ||
    !req.body.name ||
    !req.body.description ||
    !req.body.teamId
  )
    return res.status(401).send("Process failed: Incomplete data");

  const validId = mongoose.Types.ObjectId.isValid(req.body.teamId);
  if (!validId) return res.status(401).send("Process failed: Invalid id");

  const exist = await Team.findById(req.body.teamId);
  if (!exist) return res.status(401).send("Process failed: team doesn't exist");

  const board = await Board.findByIdAndUpdate(req.body._id, {
    name: req.body.name,
    description: req.body.description,
    teamId: req.body.teamId,
    active: false,
  });
  if (!board) return res.status(401).send("Process failed: board not found");
  return res.status(200).send({ board });
});

module.exports = router;