const jwt = require("jsonwebtoken");

const auth = (req, res, next)=>{
    
    let token = req.header("authorization");
    if(!token) return res.status(401).send("Process Failed: the token doesn't exist ")

    token = token.split(" ")[1]
    if(!token) return res.status(401).send("Process Failed: the token doesn't exist")

    try {        
        const payload = jwt.verify(token, process.env.SECRET_kEY_JWT)    
        req.user = payload;
        next();
    } catch (error) {        
        return res.status(401).send("Process Failed: the token doesn't validated")
    }
    
}

module.exports = auth;