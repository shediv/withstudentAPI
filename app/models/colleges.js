/*
    Description : This model is for class collection.
*/
var mongoose = require('mongoose');

var colleges = mongoose.model('colleges', new mongoose.Schema({},{strict : false}));

module.exports = { Colleges: colleges};