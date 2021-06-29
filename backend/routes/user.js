const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const multipart = require("connect-multiparty"); //img
const mult = multipart(); //img
const fs = require("fs"); //Img
const path = require("path"); //Img
const moment = require("moment"); // Img

const Role = require("../models/role");
const User = require("../models/user");
const Auth = require("../middleware/auth");
const UserAuth = require("../middleware/user");
const Admin = require("../middleware/admin");
const Upload = require("../middleware/file");
const ScrumMaster = require("../middleware/scrumMaster");

router.post("/add", async (req, res) => {
  if (!req.body.fullName || !req.body.email || !req.body.password)
    return res.status(401).send("Process failed: Incomplete data");

  let user = await User.findOne({ email: req.body.email });
  if (user)
    return res
      .status(401)
      .send("Process failed: The user is already registered");

  const hash = await bcrypt.hash(req.body.password, 10);

  const role = await Role.findOne({ name: "user" });
  if (!role)
    return res.status(401).send("Process failed: No role was assigned");

  const imageUrl =
    req.protocol + "://" + req.get("host") + "/img/users/1234567890.jpg";

  user = new User({
    fullName: req.body.fullName,
    email: req.body.email,
    password: hash,
    roleId: role._id,
    imageUrl: imageUrl,
  });

  try {
    const result = await user.save();
    if (!result) return res.status(401).send("Failed to register user");
    const jwtToken = user.generateJWT();
    res.status(200).send({ jwtToken });
  } catch (e) {
    return res.status(401).send("Failed to register user");
  }
});

router.get("/get/:fullName?", Auth, UserAuth, Admin, async (req, res) => {
  const user = await User.find({
    fullName: new RegExp(req.params["fullName"], "i"),
  })
    .populate("roleId")
    .exec();
  if (!user) return res.status(401).send("Error fetching user information");
  return res.status(200).send({ user });
});

router.get("/getUser", Auth, UserAuth, async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(401).send("Error fetching user information");
  return res.status(200).send({ user });
});

router.post("/addUserAdmin", Auth, UserAuth, Admin, async (req, res) => {
  if (
    !req.body.fullName ||
    !req.body.email ||
    !req.body.password ||
    !req.body.roleId
  )
    return res.status(401).send("Process failed: Incomplete data");

  let user = await User.findOne({ email: req.body.email });
  if (user)
    return res
      .status(401)
      .send("Process failed: The user is already registered");

  const hash = await bcrypt.hash(req.body.password, 10);

  const validRole = mongoose.isValidObjectId(req.body.roleId);
  if (!validRole) return res.status(401).send("Process failed: Invalid role");

  const role = await Role.findById(req.body.roleId);
  if (!role)
    return res.status(401).send("Process failed: No role was assigned");

  const imageUrl =
    req.protocol + "://" + req.get("host") + "/img/users/1234567890.jpg";

  user = new User({
    fullName: req.body.fullName,
    email: req.body.email,
    password: hash,
    roleId: role._id,
    imageUrl: imageUrl,
  });

  try {
    const result = await user.save();
    if (!result) return res.status(401).send("Failed to register user");
    const jwtToken = user.generateJWT();
    res.status(200).send({ jwtToken });
  } catch (e) {
    return res.status(401).send("Failed to register user");
  }
});

router.put("/update", Auth, UserAuth, Admin, async (req, res) => {
  if (
    !req.body.fullName ||
    !req.body.email ||
    !req.body.password ||
    !req.body.roleId ||
    !req.body._id
  )
    return res.status(401).send("Process failed: Incomplete data");

  const validId = mongoose.isValidObjectId(req.body._id);
  if (!validId) return res.status(401).send("Process failed: Invalid Id");

  const findUser = await User.findById(req.body._id);
  if (!findUser) return res.status(401).send("Process failed: Invalid User");

  if (findUser.email !== req.body.email) {
    const findEmail = await User.findOne({ email: req.body.email });
    if (findEmail)
      return res.status(401).send("Process failed: The email isn't available");
  }

  const hash = await bcrypt.hash(req.body.password, 10);

  const validRole = mongoose.isValidObjectId(req.body.roleId);
  if (!validRole) return res.status(401).send("Process failed: Invalid role");

  const role = await Role.findById(req.body.roleId);
  if (!role)
    return res.status(401).send("Process failed: No role was assigned");

  const user = await User.findByIdAndUpdate(req.body._id, {
    fullName: req.body.fullName,
    email: req.body.email,
    password: hash,
    roleId: role._id,
    imageUrl: findUser.imageUrl,
    active: true,
  });

  if (!user) return res.status(401).send("Process failed: Error updating user");
  return res.status(200).send({ user });
});

router.put("/updateImg", mult, Upload, Auth, UserAuth, async (req, res) => {
  if (!req.user._id)
    return res.status(401).send("Process failed: Incomplete data");

  const validId = mongoose.isValidObjectId(req.user._id);
  if (!validId) return res.status(401).send("Process failed: Invalid Id");

  const findUser = await User.findById(req.user._id);
  if (!findUser) return res.status(401).send("Process failed: Invalid User");

  const url = req.protocol + "://" + req.get("host") + "/";
  let imageUrl = url + "img/users/1234567890.jpg";

  if (req.files !== undefined && req.files.image.type) {
    let serverImg =
      "./img/users/" + moment().unix() + path.extname(req.files.image.path);
    fs.createReadStream(req.files.image.path).pipe(
      fs.createWriteStream(serverImg)
    );
    imageUrl =
      url + "img/users/" + moment().unix() + path.extname(req.files.image.path);
  }

  const user = await User.findByIdAndUpdate(req.user._id, {
    fullName: findUser.fullName,
    email: findUser.email,
    password: findUser.password,
    roleId: findUser.roleId,
    imageUrl: imageUrl,
    active: true,
  });
  if (!user) return res.status(401).send("Process failed: Error updating user");
  return res.status(200).send({ user });
});

router.put("/delete", Auth, UserAuth, Admin, async (req, res) => {
  if (
    !req.body.fullName ||
    !req.body.email ||
    !req.body.password ||
    !req.body.roleId ||
    !req.body._id
  )
    return res.status(401).send("Process failed: Incomplete data");

  const validId = mongoose.isValidObjectId(req.body._id);
  if (!validId) return res.status(401).send("Process failed: Invalid Id");

  const findUser = await User.findById(req.body._id);
  if (!findUser) return res.status(401).send("Process failed: Invalid User");

  if (findUser.email !== req.body.email) {
    const findEmail = await User.findOne({ email: req.body.email });
    if (findEmail)
      return res.status(401).send("Process failed: The email isn't available");
  }

  const hash = await bcrypt.hash(req.body.password, 10);

  const validRole = mongoose.isValidObjectId(req.body.roleId);
  if (!validRole) return res.status(401).send("Process failed: Invalid role");

  const role = await Role.findById(req.body.roleId);
  if (!role)
    return res.status(401).send("Process failed: No role was assigned");

  const user = await User.findByIdAndUpdate(req.body._id, {
    fullName: req.body.fullName,
    email: req.body.email,
    password: hash,
    roleId: role._id,
    imageUrl: findUser.imageUrl,
    active: false,
  });

  if (!user) return res.status(401).send("Process failed: Error updating user");
  return res.status(200).send({ user });
});

module.exports = router;
