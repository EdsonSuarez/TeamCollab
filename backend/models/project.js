const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    name: String,
    description: String,
    status: {type: String, default: "to-do"},
    active: {type: Boolean, default: true},
    date: {type: Date, default: Date.now}    
});

const Project = mongoose.model("project", projectSchema);

module.exports = Project;