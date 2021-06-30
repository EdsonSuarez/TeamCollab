const upload = (req, res, next) => {
  console.log("Hola", typeof(req.files));
  if ( req.files.type == undefined || req.files.type == null){
    next();
  } else {
    console.log("entro");
    if (req.files.image.type) {
      let type = req.files.image.type;
      if (
        type !== "image/png" &&
        type !== "image/jpg" &&
        type !== "image/jpeg" &&
        type !== "image/gif" 
      )
        return res
          .status(401)
          .send("Invalid format: only .png, .jpg, .jpeg, .gif");
      next();
    } else {
      next();
    }
  }
};

module.exports = upload;
