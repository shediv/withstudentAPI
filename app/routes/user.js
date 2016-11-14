/**
 * Created by shediv on 03/08/15.
 */

var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var UserCtrl = new (require('../controllers/user')).User();
this.config = require('../config/config.js');

var auth = jwt({
  secret: this.config.secret,
  userProperty: 'payload'
});

//router.get("/", UserCtrl.getUsers); //... Get all users
router.post("/", UserCtrl.loginUser); //... Login API
router.post('/fblogin', UserCtrl.facebookSignin); //.. FB Reg API
router.post('/glogin', UserCtrl.googleSignin); //.. Google Reg API
router.post('/register', UserCtrl.register); //.. Reg API
router.get('/current', auth, UserCtrl.current); //.. Verify user Account
router.get('/verify', auth, UserCtrl.verify); //.. Verify user Account
router.post('/guestRegister', UserCtrl.guestSignUp); //.. Guest SignUp API
router.post('/fpVerify', auth, UserCtrl.forgotPasswordVerify); //.. Set new Password Password API
router.post('/oldPasswordVerify', auth, UserCtrl.oldPasswordVerify); //.. Check if old Password Matches API
router.post('/forgotPassword', UserCtrl.forgotPassword); //.. forgotPassword send email
router.get('/profile', auth, UserCtrl.profile); //.. Get profile data API
//router.post('/getPasswordHint', UserCtrl.getUserPasswordHint); //... Get user Password hint based on the email
router.put('/profile', auth, UserCtrl.updateProfile); //.. Edit profile API
router.put('/addPicture', auth, UserCtrl.uploadProfilePic); //.. Edit profile picture API

router.put('/personalInfo', auth, UserCtrl.addPersonalInfo); //.. add Personal Info
router.put('/academicInfo', auth, UserCtrl.addAcademicInfo); //.. add Academic Info
router.put('/professionalInfo', auth, UserCtrl.addProfessionalInfo); //.. add Professional Info
router.put('/extraInfo', auth, UserCtrl.addExtraInfo); //.. add Professional Info

router.get("/:id", UserCtrl.getUserByID); //... Search user base on ID
router.post("/:id", UserCtrl.updateUserByID); //... Search user base on ID

module.exports = router;
