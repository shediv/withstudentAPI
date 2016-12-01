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
router.get("/hod", auth, CollegeCtrl.getDepartmentHODList); //... Get all Principal List
router.get("/vicePrincipal", auth, CollegeCtrl.getVicePrincipalList); //... Get all Principal List

router.get("/vicePrincipal", auth, CollegeCtrl.getVicePrincipalList); //... Get all Vice Principal List
router.get("/hod", auth, CollegeCtrl.getDepartmentHODList); //... Get all Department HOD List
router.post("/", auth, CollegeCtrl.addCollegeDetails); //... add Colleges Details
router.post("/department", auth, CollegeCtrl.addCollegeDepartment); //... add Colleges Department Details
router.post("/TTtemplate", auth, CollegeCtrl.addCollegeTimeTableTemplate); //... add Colleges Time Table Template
router.post("/marksSheetTemplate", auth, CollegeCtrl.addCollegeMarksEntrySheetTemplate); //... add Colleges Time Table Template 
router.post("/collegeAdmin", auth, CollegeCtrl.addCollegeAdminInfo); //... add College Admin Info 
router.post("/addVicePrincipal/:collegeId", auth, CollegeCtrl.addVicePrincipal); //... add Vice Principal
router.post("/addCoordinators/:collegeId", auth, CollegeCtrl.addCoordinators);  //... add Coordinators for college
router.get("/:collegeId", auth, CollegeCtrl.getCollegesDetails); //... Get details of a college

module.exports = router;