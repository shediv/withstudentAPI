var User = function()
{
	var async = require('async');
	var User = require('../models/user').User;
	var fs = require('fs');
	var crypto =require('crypto');
	var passport = require('passport');
	var imagick = require('imagemagick');
	var mongoose = require('mongoose');
	var nodeMailer = require('nodemailer');
	var constants = require('../libraries/constants')
	var CommonLib = require('../libraries/common').Common;
	var shell = require('shelljs');

	var path = require('path');
	var EmailTemplate = require('email-templates').EmailTemplate;
	var templatesDir = path.resolve(__dirname, '../..', 'public/templates/emailTemplates');

	var md5 = require('md5');

	this.params = {};
	this.config = require('../config/config.js');
	var self = this;

	// this.transporter = nodeMailer.createTransport({
	//     service: self.config.smtpService,
	//     host: self.config.smtpHost,
	//     port: self.config.smtpPort,
	//     auth: self.config.smtpAuth
	// });

	//For Gmail as SMTP server
	this.transporter = nodeMailer.createTransport({
		host: 'smtp.gmail.com',
		secure: true,
		port: 465,
		auth: {
			user: 'presley.cci@gmail.com', //'withstudent.development@gmail.com',
			pass:  'Slaay1988cc' //'8088025492'
		}
	});

	//...Get all users
	this.getUsers = function(req, res){
		User.find({}).lean().exec(function(err, users){
			return res.status(200).json({users : users});
		})
	};

	//..Get user based on ID
	this.getUserByID = function(req, res){
		User.findOne({_id : req.params.id}).lean().exec(function(err, user){
			return res.status(200).json({user : user});
		})
	};

	//..Update user based on ID
	this.updateUserByID = function(req, res){
		User.findOneAndUpdate({_id : req.params.id}, {$set: { email: req.body.email, name : req.body.title }}, {upsert:true}, function(err, doc){
			  if(err) return res.status(500).json(err);
			  return res.status(200).json({user : doc});
		});
	};

	this.loginUser = function(req, res){	
		passport.authenticate('local', function(err, user, info){
	    var token;

	    // If Passport throws/catches an error
	    if (err) {
	      res.status(404).json(err);
	      return;
	    }

	    // If a user is found
	    if(user){
	    	if(!user.isVerified){
	    		//Email not verified
	    		res.status(401).json({message : constants.constEmailNotVerified});
	    	}else{
		    	if(req.body.rememberme){token = user.generateLongJwt();}
		    	else{token = user.generateLongJwt();}
			      res.status(200);
			      res.json({
			        token : token
			      });
		    }  
	    } else {
	      // If user is not found
	      res.status(401).json(info);
	    }

	  })(req, res);
	};

	//Sign Up
	this.register = function(req, res) {
		User.findOne({emailAddress: req.body.emailAddress, isActive : 1},function(err, result){
			if(result){
				return res.status(403).json({message: constants.constEmailAlreadyRegistered})
			}
			else{
				  var newUser = new User();
				  newUser.firstName = req.body.firstName;
				  newUser.lastName = req.body.lastName;
				  newUser.dob = req.body.dob;
				  newUser.phone = req.body.phone;
				  newUser.emailAddress = req.body.emailAddress;
				  newUser.gender = req.body.gender;
				  newUser.passwordLastUpdatedAt = new Date();
				  newUser.createdAt = new Date();
				  newUser.updatedAt = new Date();
				  newUser.usertype = req.body.usertype;
				  newUser.isActive = 1;
				  newUser.isVerified = false;
				  newUser.setPassword(req.body.password);

				newUser.save(function(err) {
				    var token;
			        token = newUser.generateJwt();
				    res.status(200).json({message: constants.constNewUserIsCreated, userID: newUser._id});
				    //Set Mail Options
				    var mailOptions = {
				      emailAddress: req.body.emailAddress,
				      name: {
				        first: req.body.firstName,
				        last: req.body.lastName
				      },
				      userId:newUser._id,
				      token:token,
				      appHost:self.config.appHost
				    };

				    //console.log(newUser._id);
				    //To send verification mail to user
				    var emailTemplate = new EmailTemplate(path.join(templatesDir, 'register'));
					emailTemplate.render(mailOptions, function(err, results){
						if(err) return console.error(err)
						self.transporter.sendMail({
					        from: "help@withstudent.com", // sender address
					        to: mailOptions.emailAddress, // list of receivers
					        subject: 'One Last Step To Create Your Account!',
				        	html: results.html
						}, function(err, responseStatus){
							if(err) return console.log(err);
						   	console.log("responseStatus.message");
						})
					});
			  	});
			}
		})  
	};

	this.verify = function(req, res){
		if (!req.payload._id) {
	    	res.status(401).json({message : constants.constUnAuthorizedAccess});
	  	} else {
		    User.findById(req.payload._id).exec(function(err, user) {
		    	User.findOneAndUpdate({_id : user._id}, {$set: { isActive: 1, isVerified : true }}, {upsert:true}, function(err, userInfo){
				  if(err) return res.status(500).json(err);
				  return res.status(200).json({msg: constants.constUserEmailVerified, user : userInfo});
				});
		       	//res.status(200).json(user);
		    });
	  	}
	}

	this.current = function(req, res){
		if (!req.payload._id) {
	    	res.status(401).json({message : constants.constUnAuthorizedAccess});
	  	} else {
		    User.findById(req.payload._id).exec(function(err, user) {
				return res.status(200).json({msg: "User has sucessfully Logged in", user : user});		       	
		    });
	  	}
	}

	//FB SignUP/SignIN
	this.facebookSignin = function(req, res){
		var user = req.body.user;
		User.findOne(
			{email: user.email, isActive : 1},
			function(err, result){

				if(err) return res.status(500).json(err);
				if(result)
				{	
                   	token = result.generateJwt();
					res.status(200).json({token:token});
					if(result.facebookId === undefined)
					{
						result.facebookId = user.id;
						result.save(err);
					}
				}
				else
				{
					var userDetails = {};
					userDetails.createdAt = new Date();
					userDetails.isActive = 1;
					userDetails.isVerified = true;
					userDetails.email = user.email;
					userDetails.firstName = user.firstName;
					userDetails.lastName = user.lastName;
					userDetails.facebookId = user.id;
					userDetails.profilePic = user.picture;
					newUser.loginType = "registered";
					// create a new Media
					var newUser = User(userDetails);

					// save the Media
					newUser.save(function(err) {
						if (err) throw err;
						user._id = newUser._id;
           			    var token = newUser.generateJwt();
						res.status(200).json({userId:newUser._id,token:token});
						//mkdirp('../public/images/users/'+newUser._id);
					});
				}
			}
		);
	}

	//Google SignUP/SignIN
	this.googleSignin = function(req, res){
		var user = req.body.user;
		User.findOne(
			{email: user.email, isActive : 1},
			function(err, result){

				if(err) return res.status(500).json(err);
				if(result)
				{	
					token = result.generateJwt();
					res.status(200).json({token:token});
					if(result.facebookId === undefined)
					{
						result.facebookId = user.id;
						result.save(err);
					}
				}
				else
				{
					var userDetails = {};
					userDetails.createdAt = new Date();
					userDetails.isActive = 1;
					userDetails.isVerified = 1;
					userDetails.email = user.email;
					userDetails.firstName = user.firstName;
					userDetails.lastName = user.lastName;
					userDetails.googleId = user.googleId;
					userDetails.profilePic = user.picture;
					// create a new Media
					var newUser = User(userDetails);

					// save the Media
					newUser.save(function(err) {
						if (err) throw err;
						user._id = newUser._id;
                      	var token = newUser.generateJwt();
						res.status(200).json({userId:newUser._id,token:token});
						//mkdirp('../public/images/users/'+newUser._id);
					});
				}
			}
		);
	}
 
	//Guest SignUP/SignIN
	this.guestSignUp = function(req, res){
		User.findOne(
			{email: req.body.email, isActive : 1},
			function(err, result){
				if(err) {
					return res.status(500).json({message: constants.constGuesUserRegistrationFailed});
				}
				if(result){	
					token = result.generateJwt();
					res.status(200).json({token:token});
				}
				else{
					var userDetails = {};
					userDetails.createdAt = new Date();
					userDetails.isActive = 1;
					userDetails.email = req.body.email;
					userDetails.firstName = req.body.firstName;
					userDetails.lastName = req.body.lastName;
					userDetails.isVerified = false;
					userDetails.loginType = "guest";
					// create a new Media
					var newUser = User(userDetails);

					// save the Media
					newUser.save(function(err) {
						if (err) {
						//409 Conflict
						  return res.status(409).json({message: constants.constGuesUserAlreadyRegistered});
						}

						var token = newUser.generateJwt();
						res.status(200).json({token: token});
					});
				}
			}
		);
	}

	//Forgot Password
	this.forgotPassword	= function(req,res){
		User.findOne({emailAddress: req.body.emailAddress, isActive : 1}, function(err, userInfo){
			if(!userInfo) return res.status(404).json({message:constants.constEmailDoesntExist});
			if(userInfo){
           		var token = userInfo.generateJwt();
				var mailOptions = {
			      emailAddress: userInfo.emailAddress,
			      name: {
			        first: userInfo.firstName,
			        last: userInfo.lastName
			      },
			      appHost: self.config.appHost,
			      token: token
			    };

			    var emailTemplate = new EmailTemplate(path.join(templatesDir, 'forgotPassword'));

		    	emailTemplate.render(mailOptions, function(err, results){
					if(err) return res.status(500).json({message: constants.constEmailNotSent});
					self.transporter.sendMail({
		        		from: constants.constFromEmailID, // sender address
				        to: mailOptions.emailAddress, // list of receivers
				        subject: constants.constResetPasswordMessage,
		        		html: results.html
					}, function(err, responseStatus){
						if(err) res.status(500).json({message: constants.constEmailNotSent});
						res.status(200).json({message: constants.constEmailSent});
					})
				});
			}
		})
	};

	//Set new Password Password
	this.forgotPasswordVerify = function(req, res){
		if (!req.payload._id) {
	    	res.status(401).json({message: constants.constUnAuthorizedAccess});
	  	} else {
		    User.findById(req.payload._id).exec(function(err, user) {		    	
		  		user.setPassword(req.body.newPassword);
		    	User.findOneAndUpdate({_id : user._id}, {$set: { hash: user.hash, salt: user.salt, passwordLastUpdatedAt : new Date() }}, {upsert:true}, function(err, userInfo){
				  if(err) return res.status(500).json({message: constants.constUserPasswordUpdatedError});
				  return res.status(200).json({message: constants.constUserPasswordUpdated});
				});
		    });
	  	}
	}

	this.profile = function(req, res) {	

	 if (!req.payload._id) {
	    res.status(401).json({
	      message : constants.constUnAuthorizedAccess
	    });
	  } else {
	  	var notificationPrefrenceArray = [];
	    User.findOne({ _id : req.payload._id }).lean().exec(function(err, user) {
	    	delete user.hash;delete user.salt;delete user.loginType;delete user.passwordLastUpdatedAt;
			return res.status(200).json({ user: user });	
	    });
	  } 
	};

	this.updateProfile = function(req, res) {	
	 if (!req.payload._id) {
	    res.status(401).json({
	      message : constants.constUnAuthorizedAccess
	    });
	  } else {
	    User.findById(req.payload._id).exec(function(err, user) {
	    	var userData = {
	    		firstName : req.body.data.firstName,
	    		lastName : req.body.data.lastName,
	    		profilePic : req.body.data.profilePic,	    		
	    		notificationPrefrence : req.body.data.notificationPrefrence,
	    		emailPrefrence : req.body.data.emailPrefrence,
	    		emailPromotional : req.body.data.emailPromotional,
	    		passwordHint : req.body.data.passwordHint
	    	}

	    	if(req.body.data.newPassword) {
	    		user.setPassword(req.body.data.newPassword);
	    		userData.salt = user.salt;
	    		userData.hash = user.hash;
	    	}
	    	//console.log(userData);

	    	User.findOneAndUpdate({_id : user._id}, userData, {upsert : true, new : true}, function(err, updatedUser){
				return res.status(200).json({user : updatedUser});
			})
	    });
	  } 
	};

	//Add personal information
	this.addPersonalInfo = function(req, res) {	
	 if (!req.payload._id) {
	    res.status(401).json({
	      message : constants.constUnAuthorizedAccess
	    });
	  } else {
	    User.findById(req.payload._id).exec(function(err, user) {
	    	var userData = {
	    		name : req.body.name,
				dob : req.body.name,
				gender : req.body.gender,
				address : {
					permanent : req.body.address.permanent,
				    postal : req.body.address.postal,

				},
				phone1 : req.body.phone1,
				phone2 : req.body.phone1,
				mobile : req.body.mobile,
				alternateMobile : req.body.alternateMobile,
				alternateEmailAddress : req.body.alternateEmailAddress,
				fatherName : req.body.fatherName,
				fatherMobile : req.body.fatherMobile,
				fatherEmailAddress : req.body.fatherEmailAddress,
				motherName : req.body.motherName,
				motherMobile : req.body.motherMobile,
				motherEmailAddress : req.body.motherEmailAddress,
				guardianName1 : req.body.guardianName1,
				guardianMobile1 : req.body.guardianMobile1,
				guardianEmailAddress1 : req.body.guardianEmailAddress1,
				guardianName2 : req.body.guardianName2,
				guardianMobile2 : req.body.guardianMobile2,
				guardianEmailAddress2 : req.body.guardianEmailAddress2,
				guardianParentMobile : req.body.guardianParentMobile,
				guardianParentEmailAddress : req.body.guardianParentEmailAddress,
	    	}
	    	//console.log(userData);

	    	User.findOneAndUpdate({_id : user._id}, userData, {upsert : true, new : true}, function(err, updatedUser){
				return res.status(200).json({user : updatedUser});
			})
	    });
	  } 
	};

	this.addAcademicInfo = function(req, res) {	
	 if (!req.payload._id) {
	    res.status(401).json({
	      message : constants.constUnAuthorizedAccess
	    });
	  } else {
	    User.findById(req.payload._id).exec(function(err, user) {
	    	var userData = {
	    		currentlyStudying : req.body.currentlyStudying,
				currentCourse : req.body.currentCourse,
				currentCourseName : req.body.currentCourseName,
				currentCourseSchoolCollege : req.body.currentCourseSchoolCollege,
				currentCourseUniversity : req.body.currentCourseUniversity,
				currentCourseDepartmentBranch : req.body.currentCourseDepartmentBranch,
				currentCourseProgram : req.body.currentCourseProgram,
				currentCourseSemester : req.body.currentCourseSemester,
				currentCourseJoiningYear : req.body.currentCourseJoiningYear,
				currentCourseCompletionYear : req.body.currentCourseCompletionYear,
				ifAlumini : req.body.ifAlumini,
				aluminiNumber : req.body.aluminiNumber,
				aluminiInstitution : req.body.aluminiInstitution
	    	}
	    	//console.log(userData);

	    	User.findOneAndUpdate({_id : user._id}, userData, {upsert : true, new : true}, function(err, updatedUser){
				return res.status(200).json({user : updatedUser});
			})
	    });
	  } 
	};

	this.addProfessionalInfo = function(req, res) {	
	 if (!req.payload._id) {
	    res.status(401).json({
	      message : constants.constUnAuthorizedAccess
	    });
	  } else {
	    User.findById(req.payload._id).exec(function(err, user) {
	    	var userData = {
	    		currentlyWorking : req.body.currentlyWorking,
				currentWorkingInstitutionNumber : req.body.currentWorkingInstitutionNumber,
				currentWorks : req.body.currentWorks,
				ifPreviouslyWorked : req.body.ifPreviouslyWorked,
				previouslyWorkedNumber : req.body.previouslyWorkedNumber,
				previousWorks : req.body.previousWorks
	    	}
	    	//console.log(userData);

	    	User.findOneAndUpdate({_id : user._id}, userData, {upsert : true, new : true}, function(err, updatedUser){
				return res.status(200).json({user : updatedUser});
			})
	    });
	  } 
	};

	this.addExtraInfo = function(req, res) {	
	 if (!req.payload._id) {
	    res.status(401).json({
	      message : constants.constUnAuthorizedAccess
	    });
	  } else {
	    User.findById(req.payload._id).exec(function(err, user) {
	    	var userData = {
	    		careerGoals : req.body.careerGoals,
				hobbies : req.body.hobbies,
				favouriteSports : req.body.favouriteSports,
				favouriteMovie : req.body.favouriteMovie,
				favouritePersonality : req.body.favouritePersonality
	    	}
	    	//console.log(userData);

	    	User.findOneAndUpdate({_id : user._id}, userData, {upsert : true, new : true}, function(err, updatedUser){
				return res.status(200).json({user : updatedUser});
			})
	    });
	  } 
	};

	//Add extra documents for user
	this.addDocumentsRelatedInfo = function(req, res) {	
	 if (!req.payload._id) {
	    res.status(401).json({
	      message : constants.constUnAuthorizedAccess
	    });
	  } else {
	    User.findById(req.payload._id).exec(function(err, user) {
	    	var userData = {
	    		photo : req.body.photoUrl,
				sign : req.body.signUrl,
				SSLCMarksCard : req.body.SSLCMarksCard,
				panCard : req.body.panCard,
				aadharCard : req.body.aadharCard,
				voterId : req.body.voterId,
				drivingLicence : req.body.drivingLicence,
				rationCard : req.body.rationCard,
				otherMarksCards : req.body.otherMarksCards,
				otherCertificates : req.body.otherCertificates
	    	}
	    	//console.log(userData);

	    	User.findOneAndUpdate({_id : user._id}, userData, {upsert : true, new : true}, function(err, updatedUser){
				return res.status(200).json({user : updatedUser});
			})
	    });
	  } 
	};



	//Check if old Password Matches
	this.oldPasswordVerify = function(req, res) {	

	 if (!req.payload._id) {
	    res.status(401).json({
	      message : constants.constUnAuthorizedAccess
	    });
	  } else {
	    User.findById(req.payload._id).exec(function(err, user) {
	    	if(user.validPassword(req.body.password)){
	    		return res.status(200).json({verified:true})
	    	}else{
	    		return res.status(200).json({verified:false})
	    	} 	    		
	    });
	  } 
	};


    //Add a profile Picture
    this.uploadProfilePic = function(req, res) {
        if (!req.payload._id) {
            res.status(HttpStatus.UNAUTHORIZED).json({
                message: constants.constUnAuthorizedAccess
            });
        } else {
            User.findById(req.payload._id).exec(function(err, user) {
                var userId = user._id;
                var sourcePath = req.file.path;
                var extension = req.file.originalname.split(".");
                extension = extension[extension.length - 1];

                var path = './public/images/users/' + user._id;
                if (!fs.existsSync(path)) {
                    shell.mkdir('-p', path);
                }
                

                var destPath = "/images/users/" + userId + "/" + req.file.originalname;
                var source = fs.createReadStream(sourcePath);
                var dest = fs.createWriteStream('./public' + destPath);

                source.pipe(dest);

                source.on('end', function() {
                      var images = {
                        profileImage: destPath
                            //thumbnail : "/images/users/"+userId+"/"+userId+"_thumbnail."+extension
                    };

                    User.findOneAndUpdate({ _id: user._id }, images, { upsert: true }, function(err, result) {
                        return res.status(200).json({ images: images, userID: user._id });
                    });
                });

            });
        }
    };

    //Add a Document for a user
    this.uploadDocument = function(req, res) {
        if (!req.payload._id) {
            res.status(HttpStatus.UNAUTHORIZED).json({
                message: constants.constUnAuthorizedAccess
            });
        } else {
            User.findById(req.payload._id).exec(function(err, user) {
                var userId = user._id;
                var sourcePath = req.file.path;
                var extension = req.file.originalname.split(".");
                extension = extension[extension.length - 1];

                var path = './public/images/users/' + user._id;
                if (!fs.existsSync(path)) {
                    shell.mkdir('-p', path);
                }
                

                var destPath = "/images/users/" + userId + "/" + req.file.originalname;
                var source = fs.createReadStream(sourcePath);
                var dest = fs.createWriteStream('./public' + destPath);

                source.pipe(dest);

                source.on('end', function() {
                      var images = {
                        docUrl: destPath
                            //thumbnail : "/images/users/"+userId+"/"+userId+"_thumbnail."+extension
                    };

                    User.findOneAndUpdate({ _id: user._id }, images, { upsert: true }, function(err, result) {
                        return res.status(200).json({ document: images, userID: user._id });
                    });
                });

            });
        }
    };

}

module.exports.User = User;
