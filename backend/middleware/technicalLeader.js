const Role = require("../models/role");

const scrumMaster = async(req, res, next)=>{
        
    const validAdmin = await Role.findById(req.user.roleId);    
    if(!validAdmin) return res.status(401).send("Process failed: Role doesn't find");

    if(validAdmin.name === "admin" || validAdmin.name === "scrumMaster" || validAdmin.name === "technicalLeader") next()
    else return res.status(401).send("Process failed: Invalid Role");
}

module.exports = scrumMaster;