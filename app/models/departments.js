/*
    Description : This model is for departments collection.
*/
var mongoose = require('mongoose');

var departments = mongoose.model('departments', new mongoose.Schema({},{strict : false}));

module.exports = { Departments: departments};