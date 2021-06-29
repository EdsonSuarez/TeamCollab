const express = require("express");
const cors = require("cors");
const dbConnection = require("./db/db");

require("dotenv").config();

const Auth = require("./routes/auth");
const Board = require("./routes/board");
const Project = require("./routes/project");
const Role = require("./routes/role");
const Task = require("./routes/task");
const Team = require("./routes/team");
const User = require("./routes/user");
const DetailTask = require("./routes/detailTask");
const DetailTeam = require("./routes/detailTeam");


const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/user/", User);
app.use("/api/role/", Role);
app.use("/api/auth/", Auth);
app.use("/api/board/", Board);
app.use("/api/project", Project);
app.use("/api/task/", Task);
app.use("/api/team/", Team);
app.use("/api/detailTask", DetailTask);
app.use("/api/detailTeam", DetailTeam);
app.use("/uploads", express.static("uploads"))

app.listen(process.env.PORT, () =>
  console.log("Backend server running on port: " + process.env.PORT)
);

dbConnection();