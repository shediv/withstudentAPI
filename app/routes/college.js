/**
 * Created by shediv on 03/08/15.
 */

var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var CollegeCtrl = new (require('../controllers/college')).College();
this.config = require('../config/config.js');

var auth = jwt({
  secret: this.config.secret,
  userProperty: 'payload'
});

router.get("/", auth, CollegeCtrl.getCollegesList); //... Get all users
router.get("/principal", auth, CollegeCtrl.getPrincipalList); //... Get all Principal List
router.post("/", auth, CollegeCtrl.addCollegeDetails); //... add Colleges Details
router.post("/collegeAdmin", auth, CollegeCtrl.addCollegeAdminInfo); //... add College Admin Info 

module.exports = router;
