const Role = require("../models/role");

const admin = async (req, res, next) => {
  const validAdmin = await Role.findById(req.user.roleId);
  if (!validAdmin)
    return res.status(401).send("Process failed: Role doesn't find");
  if (validAdmin.name === "admin") next();
  else return res.status(401).send("Process failed: Invalid Role");
};

module.exports = admin;
