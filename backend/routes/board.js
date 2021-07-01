const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Board = require("../models/board");
const Team = require("../models/team");
const Auth = require("../middleware/auth");
const ScrumMaster = require("../middleware/scrumMaster");
const detailTask = require("../models/detailTask");
const UserAuth = require("../middleware/user");
const detailTeam = require("../models/detailTeam");
const Task = require("../models/task");

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

// retorna todas las tareas, boards, grupos y proyectos de un usuario
router.get("/getTasksUser", Auth, UserAuth, async (req, res) => {
  
  const tasksUser = await detailTask.find({userId: req.user._id})
  .populate({path:'taskId', populate:{path:'boardId', populate:{path:'teamId', populate:{path:'projectId'}}}})
  .exec();
  if (!tasksUser) return res.status(401).send("Error fetching tasks user");
  return res.status(200).send({ tasksUser });
});

// retorna los projectos y grupos de una persona
router.get("/getTeamUser", Auth, UserAuth, async (req, res) => {
  
  const teamsUser = await detailTeam.find({userId: req.user._id})
  .populate({path:'teamId', populate:{path:'projectId'}})
  .exec();
  if (!teamsUser) return res.status(401).send("Error fetching teams");
  return res.status(200).send({ teamsUser });
});

// retorna los teams de una persona dado un project
router.get("/getTeamsByProject/:_id", Auth, UserAuth, async (req, res) => {
  
  const teamsUser = await detailTeam.find({userId: req.user._id})
  .populate({path:'teamId', match:{projectId: req.params._id}})
  .exec();
  if (!teamsUser) return res.status(401).send("Error fetching teams");
  return res.status(200).send({ teamsUser });
});

// retorna los board de un team
router.get("/getBoards/:_id", Auth, UserAuth, async (req, res) => {
    
  const team = await Team.findById(req.params._id)
  if(!team) return res.status(401).send("Error: the team doesn't exist");

  const boards = await Board.find({teamId: req.params._id}); 
  if (!boards) return res.status(401).send("Error fetching boards");
  return res.status(200).send({ boards });
});


// retorna las task de un board
router.get("/getTasks/:_id", Auth, UserAuth, async (req, res) => {
    
  const boards = await Board.findById(req.params._id)
  if(!boards) return res.status(401).send("Error: the board doesn't exist");

  const tasks = await Task.find({boardId: req.params._id}); 
  if (!tasks) return res.status(401).send("Error fetching tasks");
  return res.status(200).send({ tasks });
});



router.put("/update", Auth, ScrumMaster, async (req, res) => {
  console.log("entro");
  if (
    !req.body._id ||
    !req.body.name ||
    !req.body.description ||
    !req.body.teamId ||
    !req.body.status
  )
    return res.status(401).send("Process failed: Incomplete data");
  console.log("paso el if");
  const validId = mongoose.Types.ObjectId.isValid(req.body.teamId);
  if (!validId) return res.status(401).send("Process failed: Invalid id");
  console.log("valid Id");

  const exist = await Team.findById(req.body.teamId);
  if (!exist) return res.status(401).send("Process failed: team doesn't exist");
  console.log("existe");

  const board = await Board.findByIdAndUpdate(req.body._id, {
    name: req.body.name,
    description: req.body.description,
    teamId: req.body.teamId,
    status: req.body.status,
    active: req.body.active,
  });

  console.log(board);

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

router.delete("/deleteBoard/:_id?", Auth, UserAuth, ScrumMaster, async (req, res) => {
  const validId = mongoose.Types.ObjectId.isValid(req.params._id);
  if (!validId) return res.status(401).send("Process failed: Invalid id");

  const board = await Board.deleteMany(req.params._id);
  if (!board) return res.status(401).send("Process failed: Team not found");
  return res.status(200).send({message: "board deleted"});
});

module.exports = router;