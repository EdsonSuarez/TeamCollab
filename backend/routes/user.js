const express = require("express")
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Role = require("../models/role");
const User = require("../models/user");
const Auth = require("../middleware/auth");
const UserAuth = require("../middleware/user");
const Admin = require("../middleware/admin");


router.post("/add", async (req, res) => {

    if (!req.body.fullName || !req.body.email || !req.body.password)
        return res.status(401).send("Process failed: Incomplete data");

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(401).send("Process failed: The user is already registered");

    const hash = await bcrypt.hash(req.body.password, 10);

    const role = await Role.findOne({ name: "user" });
    if (!role) return res.status(401).send("Process failed: No role was assigned");

    user = new User({
        fullName: req.body.fullName,
        email: req.body.email,
        password: hash,
        roleId: role._id
    });

    try {
        const result = await user.save();
        if (!result) return res.status(401).send("Failed to register user");
        const jwtToken = user.generateJWT();
        res.status(200).send({ jwtToken });
    } catch (e) {
        return res.status(401).send("Failed to register user");
    }
})


router.get("/get/:fullName?", Auth, UserAuth, Admin, async (req, res) => {
    const user = await User.find({ fullName: new RegExp(req.params["fullName"], "i")}).populate("roleId").exec();
    if (!user) return res.status(401).send("Error fetching user information");
    return res.status(200).send({ user });

});


module.exports = router;