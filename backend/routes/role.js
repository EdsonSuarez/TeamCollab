const express = require("express")
const router = express.Router();
const mongoose = require("mongoose");

const Role = require("../models/role");
const Auth = require("../middleware/auth");
const UserAuth = require("../middleware/user");
const Admin = require("../middleware/admin");

router.post("/add", Auth, UserAuth, Admin, async (req, res) => {
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


router.get("/getRole/:_id", Auth, UserAuth, Admin, async (req, res) => {
    const role = await Role.findById(req.params._id);
    if (!role) return res.status(401).send("No role");
    return res.status(200).send({ role });
});


router.put("/update", Auth, UserAuth, Admin, async (req, res) => {
    if (!req.body.name || !req.body.description || !req.body._id) 
        return res.status(401).send("Process failed: Incomplete data");

    const validId = mongoose.isValidObjectId(req.body._id);
    if(!validId) return res.status(401).send("Process failed: Invalid Id");

    const findRole = await Role.findById(req.body._id)    
    if(!findRole) return res.status(401).send("Process failed: Invalid Role");
    
    if(findRole.name !== req.body.name){
        const roleExists = await Role.findOne({ name: req.body.name });
        if (roleExists) return res.status(401).send("Process failed: role already exists");
    }    

    const role = await Role.findByIdAndUpdate(req.body._id, {
        name: req.body.name,
        description: req.body.description,
        active: true    
    });

    if (!role) return res.status(401).send("Failed to register role");
    return res.status(200).send({ role });
})


router.put("/delete", Auth, UserAuth, Admin, async (req, res) => {
    if (!req.body.name || !req.body.description || !req.body._id) 
        return res.status(401).send("Process failed: Incomplete data");

    const validId = mongoose.isValidObjectId(req.body._id);
    if(!validId) return res.status(401).send("Process failed: Invalid Id");

    const findRole = await Role.findById(req.body._id)    
    if(!findRole) return res.status(401).send("Process failed: Invalid Role");
    
    if(findRole.name !== req.body.name){
        const roleExists = await Role.findOne({ name: req.body.name });
        if (roleExists) return res.status(401).send("Process failed: role already exists");
    }    

    const role = await Role.findByIdAndUpdate(req.body._id, {
        name: req.body.name,
        description: req.body.description,
        active: false
    });

    if (!role) return res.status(401).send("Failed to register role");
    return res.status(200).send({ role });
})


module.exports = router;