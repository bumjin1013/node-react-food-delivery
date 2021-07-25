const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const moment = require("moment");

const ownerSchema = mongoose.Schema({
    name: {
        type:String,
        maxlength:50
    },
    email: {
        type:String,
        trim:true,
        unique: 1 
    },
    password: {
        type: String,
        minglength: 5
    },
    lastname: {
        type:String,
        maxlength: 50
    },
    role : {
        type:Number,
        default: 0 
    },
    image: String,
    token : {
        type: String,
    },
    tokenExp :{
        type: Number
    }
})


ownerSchema.pre('save', function( next ) {
    var owner = this;
    
    if(owner.isModified('password')){    
        // console.log('password changed')
        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err) return next(err);
    
            bcrypt.hash(owner.password, salt, function(err, hash){
                if(err) return next(err);
                owner.password = hash 
                next()
            })
        })
    } else {
        next()
    }
});

ownerSchema.methods.comparePassword = function(plainPassword,cb){
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if (err) return cb(err);
        cb(null, isMatch)
    })
}

ownerSchema.methods.generateToken = function(cb) {
    var owner = this;
    console.log('owner',owner)
    console.log('ownerSchema', ownerSchema)
    var token =  jwt.sign(owner._id.toHexString(),'secret')
    var oneHour = moment().add(1, 'hour').valueOf();

    owner.tokenExp = oneHour;
    owner.token = token;
    owner.save(function (err, owner){
        if(err) return cb(err)
        cb(null, owner);
    })
}

ownerSchema.statics.findByToken = function (token, cb) {
    var owner = this;

    jwt.verify(token,'secret',function(err, decode){
        owner.findOne({"_id":decode, "token":token}, function(err, owner){
            if(err) return cb(err);
            cb(null, owner);
        })
    })
}

const Owner = mongoose.model('Owner', ownerSchema);

module.exports = { Owner }