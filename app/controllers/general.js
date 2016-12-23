/*
  Description : Use this controller for functionality related to General data.

*/
var General = function() {
    var async = require('async');
    var Colleges = require('../models/colleges').Colleges;
    var Departments = require('../models/departments').Departments;
    var Sections = require('../models/sections').Sections;
    var User = require('../models/user').User;
    var Address = require('../models/address').Address;
    var CollegesCatalouges = require('../models/collegesCatalouges').CollegesCatalouges;
    var UniversityCatalouges = require('../models/universityCatalouges').UniversityCatalouges;
    var DepartmentCatalouges = require('../models/departmentCatalouges').DepartmentCatalouges;
    var RolesCatalouges = require('../models/rolesCatalouges').RolesCatalouges;

    this.params = {};
    this.config = require('../config/config.js');
    var self = this;

    //...Get global address
    this.address = function(req, res){
      Address.find({}).lean().exec(function(err, address){
        return res.status(200).json({address : address});
      })
    };

    //...Get global colleges
    this.colleges = function(req, res){
      CollegesCatalouges.find({}).lean().exec(function(err, colleges){
        return res.status(200).json({ colleges : colleges});
      })
    };

    //...Get global departments
    this.departments = function(req, res){
      DepartmentCatalouges.find({}).lean().exec(function(err, departments){
        return res.status(200).json({ departments : departments});
      })
    };


    //...Get global universities
    this.universities = function(req, res){
      UniversityCatalouges.find({}).lean().exec(function(err, universities){
        return res.status(200).json({ universities : universities});
      })
    };

    //...Get global universities
    this.roles = function(req, res){
      RolesCatalouges.find({}).lean().exec(function(err, roles){
        return res.status(200).json({ roles : roles});
      })
    };

}

module.exports.General = General;