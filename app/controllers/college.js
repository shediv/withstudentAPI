/*
  Description : Use this controller for functionality related to a class.

*/


var College = function() {
    var async = require('async');
    var Colleges = require('../models/colleges').Colleges;
    var Departments = require('../models/departments').Departments;
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

    this.getCollegesDetails = function(req, res) {
        if (!req.payload._id) {
           return res.status(HttpStatus.UNAUTHORIZED).json({ message: constants.constUnAuthorizedAccess });
        } else {
            User.findById(req.payload._id).exec(function(err, user) {
                if (err) return res.status(404).json({ message: constants.constUnAuthorizedAccess });
                Colleges.findOne({ _id : req.params.collegeId }).lean().exec(function(errAcademy, college) {
                    if (errAcademy || college === null) return res.status(404).json({ message: constants.constUnAuthorizedAccess });
                    Departments.find({ collegeId : college._id.toString() }).lean().exec(function(errDepartment, departments) {
                        college.departments = departments;
                        return res.status(200).json({ college: college });
                    })
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
                User.find({ type : "principal"}, { emailAddress : 1, firstName : 1, lastName : 1, profileImage : 1 }).lean().exec(function(errUsers, users) {
                    if (errUsers || users === null) return res.status(404).json({ message: constants.constUnAuthorizedAccess });
                    return res.status(200).json({ users: users });
                })
            });
        }
    }

    //Get Vice principal's list
    this.getVicePrincipalList = function(req, res) {
        if (!req.payload._id) {
           return res.status(HttpStatus.UNAUTHORIZED).json({ message: constants.constUnAuthorizedAccess });
        } else {
            User.findById(req.payload._id).exec(function(err, user) {
                if (err) return res.status(404).json({ message: constants.constUnAuthorizedAccess });
                User.find({ type : "vicePrincipal"}, { emailAddress : 1, firstName : 1, lastName : 1, profileImage : 1 }).lean().exec(function(errUsers, users) {
                    if (errUsers || users === null) return res.status(404).json({ message: constants.constUnAuthorizedAccess });
                    return res.status(200).json({ users: users });
                })
            });
        }
    }

    this.getCoordinatorsList = function(req, res) {
        if (!req.payload._id) {
           return res.status(HttpStatus.UNAUTHORIZED).json({ message: constants.constUnAuthorizedAccess });
        } else {
            User.findById(req.payload._id).exec(function(err, user) {
                if (err) return res.status(404).json({ message: constants.constUnAuthorizedAccess });
                User.find({ "currentRoles.name" : req.params.roleType }, { emailAddress : 1, firstName : 1, lastName : 1, profileImage : 1 }).lean().exec(function(errUsers, users) {
                    if (errUsers || users === null) return res.status(404).json({ message: constants.constUnAuthorizedAccess });
                    return res.status(200).json({ users: users });
                })
            });
        }
    }


    //Get Department HOD's list
    this.getDepartmentHODList = function(req, res) {
        if (!req.payload._id) {
           return res.status(HttpStatus.UNAUTHORIZED).json({ message: constants.constUnAuthorizedAccess });
        } else {
            User.findById(req.payload._id).exec(function(err, user) {
                if (err) return res.status(404).json({ message: constants.constUnAuthorizedAccess });
                User.find({ type : "HOD"}, { emailAddress : 1, firstName : 1, lastName : 1, profileImage : 1 }).lean().exec(function(errUsers, users) {
                    if (errUsers || users === null) return res.status(404).json({ message: constants.constUnAuthorizedAccess });
                    return res.status(200).json({ users: users });
                })
            });
        }
    }

    //get Department Teacher List
    this.getDepartmentTeacherList = function(req, res) {
        if (!req.payload._id) {
           return res.status(HttpStatus.UNAUTHORIZED).json({ message: constants.constUnAuthorizedAccess });
        } else {
            User.findById(req.payload._id).exec(function(err, user) {
                if (err) return res.status(404).json({ message: constants.constUnAuthorizedAccess });
                User.find({ "currentRoles.name" : "teacher"}, { emailAddress : 1, firstName : 1, lastName : 1, profileImage : 1 }).lean().exec(function(errUsers, users) {
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

    //Add College Department Details
    this.addCollegeDepartment = function(req, res) { 
     if (!req.payload._id) {
        res.status(401).json({
          message : constants.constUnAuthorizedAccess
        });
      } else {
        User.findById(req.payload._id).exec(function(err, user) {
            Colleges.findOne({ _id : req.body.collegeId, pricipalEmailAddress : user.emailAddress }).lean().exec(function(errC, collegeData){
                if(errC || collegeData == null) {
                    return res.status(501).json({ msg : "You don't have permission to perform this activity"});
                }else{
                    var departmentData = {
                        collegeId : req.body.collegeId,
                        fullName : req.body.fullName,
                        shortName : req.body.shortName,
                        numberOfSemesters : req.body.numberOfSemesters,
                        semesterYearScheme : req.body.semesterYearScheme,
                        programName : req.body.programName,
                        numberOfSections : req.body.numberOfSections,
                        sections : req.body.sections,
                        coordinators : []
                    }
                    //console.log(userData);
                    newDepartment = new Departments(departmentData);
                    newDepartment.save(function(err) {
                       return res.status(200).json({ newDepartment : newDepartment }); 
                    })
                }
            })        
        });
      } 
    };

    //add Vice Principal
    this.addVicePrincipal = function(req, res) { 
     if (!req.payload._id) {
        res.status(401).json({
          message : constants.constUnAuthorizedAccess
        });
      } else {
        User.findById(req.payload._id).exec(function(err, user) {
            Colleges.findOne({ _id : req.params.collegeId, pricipalEmailAddress : user.emailAddress }).lean().exec(function(errC, collegeData){
                if(errC || collegeData == null) {
                    return res.status(501).json({ msg : "You don't have permission to perform this activity"});
                }else{
                    var collegeData = {
                        vicePrincipal : req.body.vicePrincipal,
                        dean : req.body.dean
                    }
                    //console.log(collegeData);
                    Colleges.findOneAndUpdate({ _id : req.params.collegeId }, collegeData, {upsert : true, new : true}, function(err, updatedCollege){
                        return res.status(200).json({ college : updatedCollege});
                    })
                }
            })                
        });
      } 
    };

    this.addCoordinators = function(req, res) { 
     if (!req.payload._id) {
        res.status(401).json({
          message : constants.constUnAuthorizedAccess
        });
      } else {
        User.findById(req.payload._id).exec(function(err, user) {
            Colleges.findOne({ _id : req.params.collegeId, pricipalEmailAddress : user.emailAddress }).lean().exec(function(errC, collegeData){
                if(errC || collegeData == null) {
                    return res.status(501).json({ msg : "You don't have permission to perform this activity"});
                }else{
                        var coordinatorsData = req.body.coordinators;
                        Colleges.findOneAndUpdate({ _id : req.params.collegeId }, { coordinators : req.body.coordinators }, {upsert : true, new : true}, function(err, updatedCollege){
                            return res.status(200).json({ college : updatedCollege});
                        })
                    }
            })            
        });
      } 
    };

    //Add College Time Table Template Details
    this.addCollegeTimeTableTemplate = function(req, res) { 
     if (!req.payload._id) {
        res.status(401).json({
          message : constants.constUnAuthorizedAccess
        });
      } else {
        User.findById(req.payload._id).exec(function(err, user) {
            var timeTableData = {
                //collegeId : req.body.collegeId,
                numberOfColumns : req.body.numberOfColumns,
                monday : req.body.monday,
                tuesday : req.body.tuesday,
                wednesday : req.body.wednesday,
                thursday : req.body.thursday,
                friday : req.body.friday,
                saturday : req.body.saturday,
                sunday : req.body.sunday                
            }

            Colleges.findOneAndUpdate({_id : req.body.collegeId }, {timeTableTemplate : timeTableData}, {upsert : true, new : true}, function(err, addTTTemplate){
                return res.status(200).json({ TTTemplate : addTTTemplate});
            })
        });
      } 
    };

    //Add College Marks Entry Sheet Template
    this.addCollegeMarksEntrySheetTemplate = function(req, res) { 
     if (!req.payload._id) {
        res.status(401).json({
          message : constants.constUnAuthorizedAccess
        });
      } else {
        User.findById(req.payload._id).exec(function(err, user) {
            var marksEntryData = {
                //collegeId : req.body.collegeId,
                numberOfColumns : req.body.numberOfColumns,
                index : req.body.index,
                reportCardName : req.body.reportCardName,
                reportCardMinimumMarks : req.body.reportCardMinimumMarks,
                reportCardMinimumAttendancePercentage : req.body.reportCardMinimumAttendancePercentage,
                questionNumber : req.body.questionNumber,
                formula : req.body.formula,
                marks : req.body.marks,
                testNumber : req.body.testNumber               
            }

            Colleges.findOneAndUpdate({_id : req.body.collegeId }, { markSheetTemplate : marksEntryData}, {upsert : true, new : true}, function(err, addMarksEntryTemplate){
                return res.status(200).json({ marksEntryTemplate : addMarksEntryTemplate});
            })
        });
      } 
    };



}

module.exports.College = College;