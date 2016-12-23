/*
    Description : This model is for class collection.
*/
var mongoose = require('mongoose');

var universityCatalouges = mongoose.model('university_catalouges', new mongoose.Schema({},{strict : false}));

module.exports = { UniversityCatalouges: universityCatalouges };