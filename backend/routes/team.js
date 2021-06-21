const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Team = require("../models/team");
const DetailTeam = require("../models/detailTeam");
const User = require("../models/user");
const Auth = require("../middleware/auth");
const UserAuth = require("../middleware/user");
const ScrumM = require("../middleware/scrumMaster");

router.post("/addTeam", Auth, UserAuth, ScrumM, async (req, res) => {
  if (!req.body.name || !req.body.projectId)
    return res.status(401).send("Process failed: Incomplete data");
  const validId = mongoose.Types.ObjectId.isValid(req.body.projectId);
  if (!validId)
    return res.status(401).send("Process failed: Invalid projectId");
  const team = new Team({
    name: req.body.name,
    projectId: req.body.projectId,
    active: true,
  });
  try {
    const result = await team.save();
    if (!result)
      return res.status(401).send("Process failed: Error adding team");
    res.status(200).send({ result });
  } catch (e) {
    return res.status(401).send("Process failed: Error adding team");
  }
});

router.get("/getTeamScrum", Auth, UserAuth, ScrumM, async (req, res) => {
  const team = await DetailTeam.find({ userId: req.user._id })
    .populate()
    .exec();
  if (!team) return res.status(401).send("Process dailed: Error getting team");
  res.status(200).send({ team });
});

router.put("/updateTeam", Auth, UserAuth, ScrumM, async (req, res) => {
  if (!req.body._id || !req.body.name || !req.body.projectId)
    return res.status(401).send("Process failed: Incomplete data");
  const validId = mongoose.Types.ObjectId.isValid(req.body.projectId);
  if (!validId)
    return res.status(401).send("Process failed: Invalid projectId");
  const team = Team.findByIdAndUpdate(req.body._id, {
    name: req.body.name,
    description: req.body.description,
    active: true,
  });
  if (!team) return res.status(401).send("Process failed: Error updating team");
  res.status(200).send({ team });
});

router.put("/deleteTeam", Auth, UserAuth, ScrumM, async (req, res) => {
  if (!req.body._id || !req.body.name || !req.body.projectId)
    return res.status(401).send("Process failed: Incomplete data");
  const validId = mongoose.Types.ObjectId.isValid(req.body.projectId);
  if (!validId)
    return res.status(401).send("Process failed: Invalid projectId");
  const team = Team.findByIdAndUpdate(req.body._id, {
    name: req.body.name,
    description: req.body.description,
    active: false,
  });
  if (!team) return res.status(401).send("Process failed: Error deleting team");
  res.status(200).send("Process successfull: Team deleted");
});

module.exports = router;
