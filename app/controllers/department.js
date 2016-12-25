/*
  Description : Use this controller for functionality related to a Departments.

*/
var Department = function() {
    var async = require('async');
    var Colleges = require('../models/colleges').Colleges;
    var Departments = require('../models/departments').Departments;
    var Sections = require('../models/sections').Sections;
    var User = require('../models/user').User;

    this.params = {};
    this.config = require('../config/config.js');
    var self = this;

    //Get Department details
    this.getDepartmentDetails = function(req, res) { 
     if (!req.payload._id) {
        res.status(401).json({
          message : constants.constUnAuthorizedAccess
        });
      } else {
        User.findById(req.payload._id).exec(function(err, user) {
            Departments.findOne({ "HOD.hodId" : user._id.toString() }).lean().exec(function(errD, departmentData){
               if(err || departmentData == null) return res.status(500).json({ msg : "This user is not a HOD of the specified department"});
               //return res.status(200).json({ department : departmentData});
                Sections.find({ departmentId : departmentData._id.toString() }).lean().exec(function(errS, sectionData){
                    departmentData.sections = sectionData;
                    //console.log(departmentData._id.toString())
                    return res.status(200).json({ department : departmentData}); 
                })

            })
        });
      } 
    };

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

    //Add Department Coordinator
    this.addDepartmentCoordinator = function(req, res) { 
     if (!req.payload._id) {
        res.status(401).json({
          message : constants.constUnAuthorizedAccess
        });
      } else {
        User.findById(req.payload._id).exec(function(err, user) {
            Departments.findOne({ _id : req.params.departmentId, "HOD.hodId" : user._id.toString() }).lean().exec(function(errD, departmentData){
               if(err || departmentData == null) return res.status(500).json({ msg : "This user is not a HOD of the specified department"});
                var departmentCoordinator = {
                    coordinatorId : req.body.coordinatorId,
                    coordinatorType : req.body.coordinatorType,
                    coordinatorTypeShortName : req.body.coordinatorTypeShortName,
                    coordinatorName : req.body.coordinatorName,
                    coordinatorImage : req.body.coordinatorImage
                }
                //console.log(departmentCoordinator);
                Departments.findOneAndUpdate({ _id : req.params.departmentId }, { $push: { coordinators: departmentCoordinator } }, {upsert : true, new : true}, function(err, updatedDepartment){
                    return res.status(200).json({ department : updatedDepartment});
                })
            })
        });
      } 
    };

    //add Department Section Teacher
    this.addDepartmentSectionTeacher = function(req, res) { 
     if (!req.payload._id) {
        res.status(401).json({
          message : constants.constUnAuthorizedAccess
        });
      } else {
        User.findById(req.payload._id).exec(function(err, user) {
            Departments.findOne({ _id : req.params.departmentId, "HOD.hodId" : user._id.toString() }).lean().exec(function(errD, departmentData){
               if(err || departmentData == null) return res.status(500).json({ msg : "This user is not a HOD of the specified department"});
                var teacherData = {
                    teacherId : req.body.teacherId,
                    teacherName : req.body.teacherName,
                    teacherImage : req.body.teacherImage,
                    numberOfBatches : req.body.numberOfBatches,
                    batches : req.body.batches
                }
                //console.log(departmentCoordinator);
                Sections.findOneAndUpdate({ _id : req.params.sectionId, departmentId : req.params.departmentId }, { $push: { teachers: teacherData } }, {upsert : true, new : true}, function(err, updatedSection){
                    return res.status(200).json({ section : updatedSection});
                })
            })
        });
      } 
    };

}

module.exports.Department = Department;