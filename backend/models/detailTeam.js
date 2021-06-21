const mongoose = require("mongoose");

const detailTeamSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.ObjectId, ref: "user" },
  teamId: { type: mongoose.Schema.ObjectId, ref: "team" },
  active: Boolean,
  date: { type: Date, default: Date.now },
});

const DetailTeam = mongoose.model("detailTeam", detailTeamSchema);
module.exports = DetailTeam;
