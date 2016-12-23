/*
    Description : This model is for address collection.
*/
var mongoose = require('mongoose');

var address = mongoose.model('addresses', new mongoose.Schema({},{strict : false}));

module.exports = { Address: address};