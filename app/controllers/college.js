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

    this.getPrincipalList = function(req, res) {
        if (!req.payload._id) {
           return res.status(HttpStatus.UNAUTHORIZED).json({ message: constants.constUnAuthorizedAccess });
        } else {
            User.findById(req.payload._id).exec(function(err, user) {
                if (err) return res.status(404).json({ message: constants.constUnAuthorizedAccess });
                User.find({ type : "principal"}, { emailAddress : 1 }).lean().exec(function(errUsers, users) {
                    if (errUsers || users === null) return res.status(404).json({ message: constants.constUnAuthorizedAccess });
                    return res.status(200).json({ users: users });
                })
            });
        }
    }

    //Add personal information
    this.addCollegeAdminInfo = function(req, res) { 
     if (!req.payload._id) {
        res.status(401).json({
          message : constants.constUnAuthorizedAccess
        });
      } else {
        User.findById(req.payload._id).exec(function(err, user) {
            var userData = {
                name : req.body.name,
                dob : req.body.name,
                gender : req.body.gender,
                address : {
                    permanent : req.body.address.permanent,
                    postal : req.body.address.postal,

                },
                phone1 : req.body.phone1,
                phone2 : req.body.phone1,
                mobile : req.body.mobile,
                alternateMobile : req.body.alternateMobile,
                alternateEmailAddress : req.body.alternateEmailAddress,
                profileImage : req.body.profileImage
            }
            //console.log(userData);

            User.findOneAndUpdate({_id : user._id}, userData, {upsert : true, new : true}, function(err, updatedUser){
                return res.status(200).json({user : updatedUser});
            })
        });
      } 
    };

    //Add College Basic Details
    this.addCollegeDetails = function(req, res) { 
     if (!req.payload._id) {
        res.status(401).json({
          message : constants.constUnAuthorizedAccess
        });
      } else {
        User.findById(req.payload._id).exec(function(err, user) {
            var collegeData = {
                fullName : req.body.fullName,
                shortName : req.body.shortName,
                address : req.body.address,
                universityFullName : req.body.universityFullName,
                universityShortName : req.body.universityShortName,
                universityAddress : req.body.universityAddress,
                pricipalName : req.body.pricipalName,
                pricipalEmailAddress : req.body.pricipalEmailAddress,
                pricipalImage : req.body.pricipalImage,
                logo : req.body.pricipalImage,
                numberOfDepartments : req.body.numberOfDepartments
            }
            //console.log(userData);
            newCollege = new Colleges(collegeData);
            newCollege.save(function(err) {
               return res.status(200).json({ newCollege : newCollege }); 
            })
        });
      } 
    };



}

module.exports.College = College;