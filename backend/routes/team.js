const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Team = require("../models/team");
const DetailTeam = require("../models/detailTeam");
const User = require("../models/user");
const Auth = require("../middleware/auth");
const Admin = require("../middleware/admin");
const UserAuth = require("../middleware/user");
const ScrumM = require("../middleware/scrumMaster");
const TechnicalLeader = require("../middleware/technicalLeader");

router.post("/add", Auth, UserAuth, ScrumM, async (req, res) => {
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
  
    const result = await team.save();
    if (!result) return res.status(401).send("Process failed: Error adding team");
    const teamResult = await Team.findById(result._id).populate("projectId").exec();
    res.status(200).send({ teamResult });  
  
  });

router.get("/get", Auth, UserAuth, async (req, res) => {
  const team = await DetailTeam.find({ userId: req.user._id })
    .populate({path: "teamId", populate: "projectId"})
    .exec();
  if (!team) return res.status(401).send("Process dailed: Error getting team");
  res.status(200).send({ team });
});

router.get("/getUsers/:_id?", async (req, res) => {
  const team = await DetailTeam.find({ teamId: req.params._id})
  .populate({path: "userId", populate: "roleId"})
  .exec();
  if (!team) return res.status(401).send("Process dailed: Error getting team");
  res.status(200).send({ team });
});

router.get("/getAdmin", Auth, UserAuth, Admin, async (req, res) => {
  const team = await Team.find()
    .populate("projectId")
    .exec();
  if (!team) return res.status(401).send("Process dailed: Error getting team");
  res.status(200).send({ team });
});

router.get("/getByProject/:_id", Auth, UserAuth, async (req, res) => {
  
  const team = await Team.find({projectId: req.params._id});    
  if (!team) return res.status(401).send("Process dailed: Error getting team");
  res.status(200).send({ team });
});

router.put("/update", Auth, UserAuth, ScrumM, async (req, res) => {
  if (!req.body._id || !req.body.name || !req.body.projectId)
    return res.status(401).send("Process failed: Incomplete data");
  const validId = mongoose.Types.ObjectId.isValid(req.body.projectId);
  if (!validId)
    return res.status(401).send("Process failed: Invalid projectId");
  const team = await Team.findByIdAndUpdate(req.body._id, {
    name: req.body.name,
    projectId: req.body.projectId,
    active: true,
  });
  if (!team) return res.status(401).send("Process failed: Error updating team");
  res.status(200).send({ team });
});

router.delete("/delete/:_id?", Auth, UserAuth, ScrumM, async (req, res) => {
  const validId = mongoose.Types.ObjectId.isValid(req.params._id);
  if (!validId) return res.status(401).send("Process failed: Invalid id");

  const detailTeam = await DetailTeam.deleteMany({teamId: req.params._id});
  if (!detailTeam) return res.status(401).send("Process failed: DetailTeam not found");  

  const team = await Team.findByIdAndDelete(req.params._id);
  if (!team) return res.status(401).send("Process failed: Team not found");
  return res.status(200).send({result: "Team deleted"});
});

module.exports = router;
