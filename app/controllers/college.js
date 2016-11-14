/*
  Description : Use this controller for functionality related to a class.

*/


var College = function() {
    var async = require('async');
    var Colleges = require('../models/colleges').Colleges;
    var User = require('../models/user').User;

    this.params = {};
    this.config = require('../config/config.js');
    var self = this;

    this.getCollegesList = function(req, res) {
        if (!req.payload._id) {
           return res.status(HttpStatus.UNAUTHORIZED).json({ message: constants.constUnAuthorizedAccess });
        } else {
            User.findById(req.payload._id).exec(function(err, user) {
                if (err) return res.status(404).json({ message: constants.constUnAuthorizedAccess });
                Colleges.find({ }, {fullName : 1}).lean().exec(function(errAcademy, colleges) {
                    if (errAcademy || colleges === null) return res.status(404).json({ message: constants.constUnAuthorizedAccess });
                    return res.status(200).json({ colleges: colleges });
                })
            });
        }
    }

}

module.exports.College = College;