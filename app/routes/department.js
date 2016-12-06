/**
 * Created by shediv on 03/08/15.
 */

var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var DepartmentCtrl = new (require('../controllers/department')).Department();
this.config = require('../config/config.js');

var auth = jwt({
  secret: this.config.secret,
  userProperty: 'payload'
});


router.get("/", auth, DepartmentCtrl.getDepartmentDetails); //... get Department Details
router.post("/addHOD/:collegeId/:departmentId", auth, DepartmentCtrl.addDepartmentHOD); //... add Colleges Details
router.post("/addCoordinator/:departmentId", auth, DepartmentCtrl.addDepartmentCoordinator); //... add Colleges Details
router.post("/addSectionTeacher/:departmentId/:sectionId", auth, DepartmentCtrl.addDepartmentSectionTeacher); //... add Colleges Details
// router.get("/", auth, CollegeCtrl.getCollegesList); //... Get all users
// router.get("/principal", auth, CollegeCtrl.getPrincipalList); //... Get all Principal List
// router.get("/vicePrincipal", auth, CollegeCtrl.getVicePrincipalList); //... Get all Vice Principal List
// router.get("/hod", auth, CollegeCtrl.getDepartmentHODList); //... Get all Department HOD List
// router.post("/", auth, CollegeCtrl.addCollegeDetails); //... add Colleges Details
// router.post("/department", auth, CollegeCtrl.addCollegeDepartment); //... add Colleges Department Details
// router.post("/TTtemplate", auth, CollegeCtrl.addCollegeTimeTableTemplate); //... add Colleges Time Table Template
// router.post("/marksSheetTemplate", auth, CollegeCtrl.addCollegeMarksEntrySheetTemplate); //... add Colleges Time Table Template 
// router.post("/collegeAdmin", auth, CollegeCtrl.addCollegeAdminInfo); //... add College Admin Info 
// router.get("/:collegeId", auth, CollegeCtrl.getCollegesDetails); //... Get details of a college

module.exports = router;