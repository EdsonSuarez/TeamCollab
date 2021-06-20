const express = require("express")
const router = express.Router();
const mongoose = require("mongoose");

const Role = require("../models/role");
const Auth = require("../middleware/auth");
const UserAuth = require("../middleware/user");
const Admin = require("../middleware/admin");

// faltan los permisos de admin 
router.post("/add", async (req, res) => {
    if (!req.body.name || !req.body.description)
        return res.status(401).send("Process failed: Incomplete data");

    const roleExists = await Role.findOne({ name: req.body.name });
    if (roleExists) return res.status(401).send("Process failed: role already exists");

    const role = new Role({
        name: req.body.name,
        description: req.body.description    
    });

    const result = await role.save();
    if (!result) return res.status(401).send("Failed to register role");
    return res.status(200).send({ result });
})


router.get("/get", Auth, UserAuth, Admin, async(req, res)=>{
    const roles = await Role.find();
    if(!roles) return res.status(401).send("Error finding");

    return res.status(200).send({roles})
})


module.exports = router;