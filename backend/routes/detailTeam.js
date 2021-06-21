const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const DetailTeam = require("../models/detailTeam");

const Auth = require("../middleware/auth");
const UserAuth = require("../middleware/user");
const ScrumMaster = require("../middleware/scrumMaster");

router.post("/add", Auth, UserAuth, ScrumMaster, async (req, res) => {
  if (
    !req.body.userId ||
    !req.body.teamId 
  )
    return res.status(400).send("Process failed: Incomplete data");

  const validUserId = mongoose.Types.ObjectId.isValid(req.body.userId);
  const validTeamId = mongoose.Types.ObjectId.isValid(req.body.teamId);
  if (!validUserId || !validTeamId) return res.status(401).send("Process failed: Invalid id");


  detailTeam = new DetailTeam({
    userId: req.body.userId,
    teamId: req.body.teamId,
    active: true,
  });

  const result = await detailTeam.save();
  if (!result)
    return res.status(401).send("Process failed: Failed to register task");
  return res.status(200).send({ result });
});

router.get("/get", Auth, UserAuth, ScrumMaster, async (req, res) => {
  const detailTeam = await DetailTeam.find();
  if (!detailTeam) return res.status(401).send("Process failed: No DetailTeams to delete");
  return res.status(200).send({ detailTeam });
});

router.put("/update", Auth, UserAuth, ScrumMaster, async (req, res) => {
    if (
        !req.body._id ||
        !req.body.userId ||
        !req.body.teamId
      )
        return res.status(400).send("Process failed: Incomplete data");
    
  const validUserId = mongoose.Types.ObjectId.isValid(req.body.userId);
  const validTeamId = mongoose.Types.ObjectId.isValid(req.body.teamId);
  if (!validUserId || !validTeamId) return res.status(401).send("Process failed: Invalid id");

  const detailTeam = await DetailTeam.findByIdAndUpdate(req.body._id, {
    userId: req.user._id,
    teamId: req.body.teamId,
    status: req.body.status,
  });
  if (!detailTeam) return res.status(401).send("Process failed: DetailTeam not found");
  return res.status(200).send({ detailTeam });
});

router.delete("/delete/:_id", Auth, UserAuth, ScrumMaster, async (req, res) => {
  const validId = mongoose.Types.ObjectId.isValid(req.params._id);
  if (!validId) return res.status(401).send("Process failed: Invalid id");

  const detailTeam = await DetailTeam.findByIdAndDelete(req.params._id);
  if (!detailTeam) return res.status(401).send("Process failed: DetailTeam not found");
  return res.status(200).send("DetailTeam deleted");
});

module.exports = router;