/**
 * Created by shediv on 03/08/15.
 */

var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var GeneralCtrl = new (require('../controllers/general')).General();
this.config = require('../config/config.js');

var auth = jwt({
  secret: this.config.secret,
  userProperty: 'payload'
});


//Address Routes
router.get('/address', auth, GeneralCtrl.address); //.. Get global address API
router.get('/colleges', auth, GeneralCtrl.colleges); //.. Get global address API
router.get('/departments', auth, GeneralCtrl.departments); //.. Get global address API
router.get('/universities', auth, GeneralCtrl.universities); //.. Get global address API
router.get('/roles', auth, GeneralCtrl.roles); //.. Get global roles API

module.exports = router;