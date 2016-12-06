/*
    Description : This model is for departments collection.
*/
var mongoose = require('mongoose');

var sections = mongoose.model('sections', new mongoose.Schema({},{strict : false}));

module.exports = { Sections: sections};