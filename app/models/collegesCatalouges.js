/*
    Description : This model is for class collection.
*/
var mongoose = require('mongoose');

var collegesCatalouges = mongoose.model('colleges_catalouges', new mongoose.Schema({},{strict : false}));

module.exports = { CollegesCatalouges : collegesCatalouges};