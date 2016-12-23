/*
    Description : This model is for departments collection.
*/
var mongoose = require('mongoose');

var rolesCatalouges = mongoose.model('roles_catalouges', new mongoose.Schema({},{strict : false}));

module.exports = { RolesCatalouges: rolesCatalouges};