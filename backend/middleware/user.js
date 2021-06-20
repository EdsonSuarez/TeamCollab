const User = require("../models/user");

const user = async(req, res, next)=>{
    
    const exitUser = await User.findById(req.user._id)
    if(!exitUser) return res.status(401).send("Process failed: user doesn't exist");
    if (!exitUser.active) return res.status(401).send("Process failed: user doesn't exist");
    next();

}

module.exports = user;
