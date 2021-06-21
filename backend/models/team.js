const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
    name: String,
    projectId: {type: mongoose.Schema.ObjectId, ref: "project"},
    active: Boolean,
    date: {type: Date, default: Date.now},
});

const team = mongoose.model("team", teamSchema);

module.exports = team;