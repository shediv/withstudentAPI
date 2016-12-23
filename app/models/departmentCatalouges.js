/*
    Description : This model is for class collection.
*/
var mongoose = require('mongoose');

var departmentCatalouges = mongoose.model('department_catalouges', new mongoose.Schema({},{strict : false}));

module.exports = { DepartmentCatalouges : departmentCatalouges };