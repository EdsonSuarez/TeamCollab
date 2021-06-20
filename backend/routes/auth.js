const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");


router.post("/login", async (req, res)=> {

    if (!req.body.email || !req.body.password)
        return res.status(401).send("Process failed: Incomplete data");

    const user = await User.findOne({email: req.body.email});
    if (!user) return res.status(401).send("User or password incorrect");

    const hash = await bcrypt.compare(req.body.password, user.password);    
    if (!hash || !user.active) return res.status(400).send("User or password incorrect");

    const jwtToken = user.generateJWT();
    return res.status(200).send({ jwtToken });
});

module.exports = router;