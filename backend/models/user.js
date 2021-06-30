const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const moment = require("moment");

// AGREGAR IMG

const userSchema = mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    roleId: {type: mongoose.Schema.ObjectId, ref: 'role'},
    imageUrl: String,
    active: {type: Boolean, default: true},
    date: {type: Date, default: Date.now}    
})


userSchema.methods.generateJWT = function(){
    return jwt.sign({
        _id: this._id,
        fullName: this.fullName,
        email: this.email,
        roleId: this.roleId,
        imageUrl: this.imageUrl,
        iat: moment().unix()
    },process.env.SECRET_kEY_JWT
    )
}

const User = mongoose.model("user", userSchema);

module.exports = User;