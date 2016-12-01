/*
  Description : Use this controller for functionality related to a Departments.

*/
var Department = function() {
    var async = require('async');
    var Colleges = require('../models/colleges').Colleges;
    var Departments = require('../models/departments').Departments;
    var User = require('../models/user').User;

    this.params = {};
    this.config = require('../config/config.js');
    var self = this;

    //Add Department HOD
    this.addDepartmentHOD = function(req, res) { 
     if (!req.payload._id) {
        res.status(401).json({
          message : constants.constUnAuthorizedAccess
        });
      } else {
        User.findById(req.payload._id).exec(function(err, user) {
            var HODData = {
                hodId : req.body.hodId,
                hodName : req.body.hodName,
                hodImage : req.body.hodImage
            }
            //console.log(userData);
            Departments.findOneAndUpdate({ _id : req.params.departmentId, collegeId: req.params.collegeId }, { HOD : HODData }, {upsert : true, new : true}, function(err, updatedDepartment){
                return res.status(200).json({ department : updatedDepartment});
            })
        });
      } 
    };

}

module.exports.Department = Department;