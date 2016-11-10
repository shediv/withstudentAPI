var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var constants = require('../libraries/constants');

this.config = require('../config/config.js');
var self = this;

var userSchema = new mongoose.Schema({
  emailAddress: {
    type: String,
    unique: true,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: String,
  dob: String,
  usertype: String,
  phone: String,
  gender: String,
  passwordHint: String,
  passwordLastUpdatedAt: String,
  createdAt: String,
  updatedAt: String,
  profilePic: String,
  isActive: Number,
  isVerified: Boolean,
  hash: String,
  salt: String,
  phone1 : String,
  phone2 : String,
  mobile : String,
  alternateMobile : String,
  alternateEmailAddress : String,
  fatherName : String,
  fatherMobile : String,
  fatherEmailAddress : String,
  motherName : String,
  motherMobile : String,
  motherEmailAddress : String,
  guardianName1 : String,
  guardianMobile1 : String,
  guardianEmailAddress1 : String,
  guardianName2 : String,
  guardianMobile2 : String,
  guardianEmailAddress2 : String,
  guardianParentMobile : String,
  guardianParentEmailAddress : String,
  address : Object
});

userSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

userSchema.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
    return this.hash === hash;
};


userSchema.methods.generateJwt = function() {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + constants.constNormalTokenExpiry);
    return jwt.sign({
        _id: this._id,
        email: this.email,
        exp: parseInt(expiry.getTime() / 1000),
    }, self.config.secret); // DO NOT KEEP YOUR SECRET IN THE CODE!
};


/*
  Description : If the user has selected "Remember me" then call thie function to set a longer expiry date for the user token.
*/
userSchema.methods.generateLongJwt = function() {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + constants.constRememberMeTokenExpiry);
    return jwt.sign({
        _id: this._id,
        email: this.email,
        exp: parseInt(expiry.getTime() / 1000),
    }, self.config.secret); // DO NOT KEEP YOUR SECRET IN THE CODE!
};

var user = mongoose.model('User', userSchema);

module.exports = { User: user };
