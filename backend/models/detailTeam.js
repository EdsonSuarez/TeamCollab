const mongoose = require("mongoose");

const detailTeamSchema = new mongoose.Schema({
  teamId: { type: mongoose.Schema.ObjectId, ref: "team" },
  userId: { type: mongoose.Schema.ObjectId, ref: "user" },
  active: Boolean,
  date: { type: Date, default: Date.now },
});

const detailTeam = mongoose.model("detailTeam", detailTeamSchema);

module.exports = detailTeam;
