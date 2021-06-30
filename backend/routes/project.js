const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Project = require("../models/project");
const DetailTeam = require("../models/detailTeam");
const Team = require("../models/team");
const Auth = require("../middleware/auth");
const UserAuth = require("../middleware/user");
const AdminAuth = require("../middleware/admin");
const ScrumAuth = require("../middleware/scrumMaster");

router.post("/add", Auth, UserAuth, ScrumAuth, async (req, res) => {
  if (!req.body.name || !req.body.description)
    return res.status(401).send("Process failed: Incomplete data");

  const project = new Project({
    userId: req.user._id,
    name: req.body.name,
    description: req.body.description,
  });

  const result = await project.save();
  if (!result)
    return res.status(401).send("Process failed: Failed to register task");

  return res.status(200).send({ result });
});

router.get("/getAll", Auth, UserAuth, AdminAuth, async (req, res) => {
  const projects = await Project.find();
  if (!projects)
    return res.status(401).send("Process failed: No projects found");
  return res.status(200).send({ projects });
});

router.get("/getAllScrum", Auth, UserAuth, ScrumAuth, async (req, res) => {
  const validId = mongoose.Types.ObjectId.isValid(req.user._id);
  if (!validId) return res.status(401).send("Process failed: Invalid id");

    const projects = await Project.find().populate("userId").exec();
    if (!projects) 
        return res.status(401).send("Process failed: No projects found");

  return res.status(200).send({ projects });
});

router.get("/getMyProjects", Auth, UserAuth, async (req, res) => {
  const validId = mongoose.Types.ObjectId.isValid(req.user._id);
  if (!validId) return res.status(401).send("Process failed: Invalid id");

  const team = await DetailTeam.find({ userId: req.user._id })
    .populate({ path: "teamId", populate: "projectId" })
    .exec();
  if (!team)
    return res.status(401).send("Process failed: Team not found in DB");

  return res.status(200).send({ team });
});

router.put("/update", Auth, UserAuth, async (req, res) => {
  if (
    !req.body._id ||
    !req.body.name ||
    !req.body.description ||
    !req.body.status
  )
    return res.status(401).send("Process failed: Incomplete data");

  const validId = mongoose.Types.ObjectId.isValid(req.body._id);
  if (!validId) return res.status(401).send("Process failed: Invalid id");

  const project = await Project.findByIdAndUpdate(
    req.body._id,
    {
      name: req.body.name,
      description: req.body.description,
      status: req.body.status,
    },
    { new: true }
  );

  if (!project)
    return res.status(401).send("Process failed: Project not found");

  return res.status(200).send({ project });
});

router.put("/delete", Auth, UserAuth, ScrumAuth, async (req, res) => {
  if (!req.body._id)
    return res.status(401).send("Process failed: Incomplete data");

  const validId = mongoose.Types.ObjectId.isValid(req.body._id);
  if (!validId) return res.status(401).send("Process failed: Invalid id");

  const project = await Project.findByIdAndUpdate(
    req.body._id,
    { active: false },
    { new: true }
  );

  if (!project)
    return res.status(401).send("Process failed: Project not found");

  return res.status(200).send({ project });
});

module.exports = router;
