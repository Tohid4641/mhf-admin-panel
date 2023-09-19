const UserModel = require("../models/UserModel");
const ComplaintModel = require("../models/ComplaintModel");
const MLAModel = require("../models/MLAModel");
const EventProjectModel = require("../models/EventProjectModel");
const ContactNumberModel = require("../models/ContactNumberModel");
const ContactUsModel = require("../models/ContactUsModel");
const SocialMediaLinkingModel = require("../models/SocialMediaLinkingModel");
const ComplaintLogModel = require("../models/ComplaintLogModel");
const DepartmentModel = require("../models/DepartmentModel");
const PaymentsModel = require("../models/PaymentsModel");
const AlbumModel = require("../models/AlbumModel");
const FamilyMembersModel = require("../models/FamilyMembersModel");
const { body,validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
// helper file to prepare responses.
const apiResponse = require("../helpers/apiResponse");
const utility = require("../helpers/utility");
//const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailer = require("../helpers/mailer");
const { constants } = require("../helpers/constants");
const https = require('https');
const http = require('http');

const moment = require ("moment")


/**
 * Resend Confirm otp.
 * 
 * @param {string}
 *            mobileNo
 * 
 * @returns {Object}
 */
exports.resendConfirmOtp = [
	body("mobileNo").isLength({ min: 1 }).trim().withMessage("Mobile Number must be specified.")
		.isNumeric().withMessage("Moile No be a valid Mobile Number."),
	sanitizeBody("mobileNo").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				var query = {mobileNo : req.body.mobileNo};
				UserModel.findOne(query).then(user => {
					if (user) {
					
							// Generate otp
							let otp = utility.randomNumber(4);
							user.confirmOTP = otp;
							let otpLink = utility.otpLink(req.body.mobileNo,otp);
							http.get(otpLink, (resp) => {
								  let data = '';

								//   // A chunk of data has been recieved.
								//   resp.on('data', (chunk) => {
								//     data += chunk;
								//   });

								//   // The whole response has been received. Print out the result.
								//   resp.on('end', () => {
								//     console.log(JSON.parse(data).explanation);
								//   });

								}).on("error", (err) => {
								  console.log("Error: " + err.message);
								  
								});
							// Save user.
							user.save(function (err) {
								if (err) { return apiResponse.ErrorResponse(res, err); }
								return apiResponse.successResponseWithData(res,"Confirm otp sent.",user);
							});
						
					}else{
						

						let randomNumber = Math.floor(Math.random() * 100000000);
						randomNumber = '' + randomNumber;
						while (randomNumber.length < 8) {
							randomNumber = randomNumber + '0';
						}
						const currentDate = moment()
						const dateFormat = currentDate.format('MMYY')
						const memberShipId = dateFormat+randomNumber;
						

						let otp = utility.randomNumber(4);
						// Create User object with escaped and trimmed data
						var user = new UserModel(
							{
								
								mobileNo: req.body.mobileNo,
								confirmOTP: otp,
								memberShipId: memberShipId
							}
						);

						// Save user.
						user.save(function (err) {
							if (err) { return apiResponse.ErrorResponse(res, err); }
							let userData = {
								_id: user._id,
								mobileNo: user.mobileNo,
								confirmOTP: otp
							};
							let otpLink = utility.otpLink(req.body.mobileNo,otp);
							http.get(otpLink, (resp) => {
								  let data = '';

								//   // A chunk of data has been recieved.
								//   resp.on('data', (chunk) => {
								//     data += chunk;
								//   });

								//   // The whole response has been received. Print out the result.
								//   resp.on('end', () => {
								//     console.log(JSON.parse(data).explanation);
								//   });

								}).on("error", (err) => {
								  console.log("Error: " + err.message);
								  
								});
							return apiResponse.successResponseWithData(res,"Registration Success.", userData);
					});
						
					
					}
				});
			}
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}];



/**
 * User login.
 * 
 * @param {string}
 *            mobileNo
 * @param {string}
 *            confirmOTP
 * 
 * @returns {Object}
 */
exports.login = [
	body("mobileNo").isLength({ min: 1 }).trim().withMessage("Email must be specified.")
		.isNumeric().withMessage("Mobile No must be a valid Number."),
	body("otp").isLength({ min: 1 }).trim().withMessage("OTP must be specified."),
	sanitizeBody("mobileNo").escape(),
	sanitizeBody("otp").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				UserModel.findOne({mobileNo : req.body.mobileNo}).then(user => {
					if (user) {
						
							if(user.confirmOTP == req.body.otp){
								
									if(user.status) {
										let userDataPayload = {
											_id: user._id,
											fullName: user.fullName,
											mobileNo: user.mobileNo,
											userAddress: user.userAddress,
											userPhoto: user.userPhoto
										};

										let userData = JSON.parse(JSON.stringify(user));
										delete userData.confirmOTP;

										// Prepare JWT token for authentication
										const jwtPayload = userDataPayload;
										const jwtData = {
											expiresIn: process.env.JWT_TIMEOUT_DURATION,
										};
										const secret = process.env.JWT_SECRET;
										// Generated JWT token with Payload and
										// secret.
										userData.token = jwt.sign(jwtPayload, secret, jwtData);
										user.token=userData.token;
										user.save(function (err) {
											if (err) { return apiResponse.ErrorResponse(res, err); }
											return apiResponse.successResponseWithData(res,"Login Success.", userData);
										});
										
									}else {
										return apiResponse.unauthorizedResponse(res, "Account is not active. Please contact admin.");
									}
								
							}else{
								return apiResponse.unauthorizedResponse(res, " OTP wrong.");
							}
						
					}else{
						return apiResponse.unauthorizedResponse(res, "Mobile Number or OTP wrong.");
					}
				});
			}
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}];


/**
 * User Update Profile.
 * 
 * @param {string}
 *            mobileNo
 * @param {string}      fullName
 * @param {string}      mobileNo
 * @param {string}      voterId
 * @param {string}      userAddress
 *  @param {string}      userPhoto
 *  @param {string}      token
 * 
 * 
 * @returns {Object}
 */
exports.updateProfile = [
	body("mobileNo").isLength({ min: 1 }).trim().withMessage("Mobile Number must be specified.")
		.isNumeric().withMessage("Mobile No must be a valid Number."),
	//body("voterId").isLength({ min: 1 }).trim().withMessage("Voter Id must be specified.")
		//.isAlphanumeric().withMessage("Voter Id  has non-alphanumeric characters."),
	body("fullName").isLength({ min: 1 }).trim().withMessage("Name must be specified."),
	//	.isAlphanumeric().withMessage("Name has non-alphanumeric characters."),
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),
	sanitizeBody("mobileNo").escape(),
	sanitizeBody("token").escape(),
	sanitizeBody("fullName").escape(),
	sanitizeBody("voterId").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				UserModel.findOne({$and:[{mobileNo : req.body.mobileNo},{token : req.body.token}]}).then(user => {
					if (user) {
						
							
								
									if(user.status) {
										user.fullName=req.body.fullName;
										user.userAddress=req.body.userAddress;
										user.voterId=req.body.voterId;
										user.userPhoto=req.body.userPhoto;
										user.profilePhoto=req.body.userPhoto;
										user.save(function (err) {
											if (err) { return apiResponse.ErrorResponse(res, err); }
											return apiResponse.successResponseWithData(res,"Updated Success.", user);
										});
										
									}else {
										return apiResponse.unauthorizedResponse(res, "Account is not active. Please contact admin.");
									}
								
							
						
					}else{
						return apiResponse.unauthorizedResponse(res, "Mobile Number or Token wrong.");
					}
				});
			}
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}];

/**
 * Update Membership.
 * 
 * @param {string}
 *            complaintTitle
 *  @param {string}      mobileNo
 *  @param {string}      token
 * 
 * 
 * @returns {Object}
 */
 exports.updateMemberShip = [
	body("mobileNo").isLength({ min: 1 }).trim().withMessage("Mobile Number must be specified.")
		.isNumeric().withMessage("Mobile No must be a valid Number."),
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),
	
	sanitizeBody("mobileNo").escape(),
	sanitizeBody("token").escape(),
	
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				UserModel.findOne({$and:[{mobileNo : req.body.mobileNo},{token : req.body.token}]}).then(user => {
					if (user) {
			

							if(!user.memberShipId){
								let randomNumber = Math.floor(Math.random() * 100000000);
								randomNumber = '' + randomNumber;
								while (randomNumber.length < 8) {
									randomNumber = randomNumber + '0';
								}
								const currentDate = moment()
								const dateFormat = currentDate.format('MMYY')
								user.memberShipId = dateFormat+randomNumber;
							}

							user.name = req.body.name;
							user.fullName = req.body.name;
							user.fatherName = req.body.fatherName;
							user.email = req.body.email;
							user.dateOfBirth = req.body.dateOfBirth;
							user.aadhar = req.body.aadhar;
							user.addressProof = req.body.addressProof;	
							user.electionId = req.body.electionId;
							user.idProof = req.body.idProof;
							user.gender = req.body.gender;
							user.maritalStatus = req.body.maritalStatus;
							user.relationType = req.body.relationType;
							user.profilePhoto = req.body.profilePhoto;
							user.contactNumber = req.body.mobileNo;
							user.address = req.body.address;
							user.area = req.body.area;
							user.city = req.body.city;
							user.state = req.body.state;
							user.zipCode = req.body.zipCode;
							user.qualification = req.body.qualification;
							user.reference = req.body.reference;
							// occupation = req.body.name;

							if(req.body.editCard){
								user.memberShipStatus = "Pending";
							}
							
							// Save user.
							user.save(function (err) {
								if (err) { return apiResponse.ErrorResponse(res, err); }


								FamilyMembersModel.updateMany({userId: user._id}, {$set:{status:false}}).then(mems => {
									
									if(req.body.familyMembers){

										let familyMembers = JSON.parse(req.body.familyMembers);
										let members = familyMembers.map((eachFamily) => {
											return { userId : user._id, name: eachFamily.name, relation: eachFamily.relation, idproof: eachFamily.id }
										})
	
										FamilyMembersModel.insertMany(members).then(mems => {
											return apiResponse.successResponseWithData(res,"User MemberShip Updated.",user);
										});
										
									} else {
										return apiResponse.successResponseWithData(res,"User MemberShip Updated.",user);
									}

								});
								
								
							});
						
					} else{
						return apiResponse.unauthorizedResponse(res, "Mobile Number or Token wrong.");
					}
				});
			}
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}];


/**
 * User Update payment.
 * 
 * @param {string}
 *            mobileNo
 * @param {string}      fullName
 * @param {string}      mobileNo
 * @param {string}      voterId
 * @param {string}      userAddress
 *  @param {string}      userPhoto
 *  @param {string}      token
 * 
 * 
 * @returns {Object}
 */
 exports.updatePayment = [
	body("mobileNo").isLength({ min: 1 }).trim().withMessage("Mobile Number must be specified.")
		.isNumeric().withMessage("Mobile No must be a valid Number."),
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),
	body("paymentType").isLength({ min: 1 }).trim().withMessage("paymentType must be specified."),
	body("paymentId").isLength({ min: 1 }).trim().withMessage("paymentId must be specified."),
	body("paymentReceipt").isLength({ min: 1 }).trim().withMessage("paymentReceipt must be specified."),
	body("paymentDuration").isLength({ min: 1 }).trim().withMessage("paymentDuration must be specified."),

	sanitizeBody("mobileNo").escape(),
	sanitizeBody("token").escape(),
	
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				UserModel.findOne({$and:[{mobileNo : req.body.mobileNo},{token : req.body.token}]}).then(user => {
					if (user) {
						
							var payment = new PaymentsModel(
								{
									userId: user._id,
									paymentType: req.body.paymentType,
									paymentId: req.body.paymentId,
									paymentReceipt: req.body.paymentReceipt,
									paymentDuration: parseInt(req.body.paymentDuration)
								}
							);
							payment.save()
							.then(payment => {

								if(payment){
									user.paymentRef = payment._id;
									user.save(function (err) {
										if (err) { return apiResponse.ErrorResponse(res, err); }
									});
								}

								return apiResponse.successResponseWithData(res,"User Payment Updated.",user);
							}).catch( err => {
								if (err) { return apiResponse.ErrorResponse(res, err); }
							})
							
					}else{
						return apiResponse.unauthorizedResponse(res, "Mobile Number or Token wrong.");
					}
				});
			}
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}];

/**
 * User Update payment.
 * 
 * @param {string}
 *            mobileNo
 * @param {string}      fullName
 * @param {string}      mobileNo
 * @param {string}      voterId
 * @param {string}      userAddress
 *  @param {string}      userPhoto
 *  @param {string}      token
 * 
 * 
 * @returns {Object}
 */
 exports.renewMembership = [
	body("mobileNo").isLength({ min: 1 }).trim().withMessage("Mobile Number must be specified.")
		.isNumeric().withMessage("Mobile No must be a valid Number."),
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),
	body("paymentType").isLength({ min: 1 }).trim().withMessage("paymentType must be specified."),
	body("paymentId").isLength({ min: 1 }).trim().withMessage("paymentId must be specified."),
	body("paymentReceipt").isLength({ min: 1 }).trim().withMessage("paymentReceipt must be specified."),
	body("paymentDuration").isLength({ min: 1 }).trim().withMessage("paymentDuration must be specified."),

	sanitizeBody("mobileNo").escape(),
	sanitizeBody("token").escape(),
	
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				UserModel.findOne({$and:[{mobileNo : req.body.mobileNo},{token : req.body.token}]}).then(user => {
					if (user) {
						
							var payment = new PaymentsModel(
								{
									userId: user._id,
									paymentType: req.body.paymentType,
									paymentId: req.body.paymentId,
									paymentReceipt: req.body.paymentReceipt,
									paymentDuration: parseInt(req.body.paymentDuration)
								}
							);

							payment.save()
							.then(payment => {

								if(payment){
									user.paymentRef = payment._id;
									user.memberShipStatus = "Pending";
									user.renewal = true;
									user.save(function (err) {
										if (err) { return apiResponse.ErrorResponse(res, err); }
									});
								}

								return apiResponse.successResponseWithData(res,"User Payment Updated.",user);
							}).catch( err => {
								if (err) { return apiResponse.ErrorResponse(res, err); }
							})
							
					}else{
						return apiResponse.unauthorizedResponse(res, "Mobile Number or Token wrong.");
					}
				});
			}
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}];



/**
 * fetch Membership.
 * 
 * @param {string}
 *            complaintTitle
 *  @param {string}      mobileNo
 *  @param {string}      token
 * 
 * 
 * @returns {Object}
 */
 exports.fetchUserProfile = [
	body("mobileNo").isLength({ min: 1 }).trim().withMessage("Mobile Number must be specified.")
		.isNumeric().withMessage("Mobile No must be a valid Number."),
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),
	
	sanitizeBody("mobileNo").escape(),
	sanitizeBody("token").escape(),
	
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				UserModel.findOne({$and:[{mobileNo : req.body.mobileNo},{token : req.body.token}]}).populate("paymentRef").then(user => {
					if (user) {
			
						FamilyMembersModel.find({userId: user._id, status:true}).then(familyMembers => {

							PaymentsModel.find({userId: user._id}).then(payments => {
								return apiResponse.successResponseWithData(res,"User profile.", { user, familyMembers, payments });
							});
							
						});

						
					} else{
						return apiResponse.unauthorizedResponse(res, "Mobile Number or Token wrong.");
					}
				});
			}
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}];

/**
 * Add Complaint.
 * 
 * @param {string}
 *            complaintTitle
 * @param {string}      complaintDescription
 * @param {string}      complaintReportType
 * @param {string}      complaintLocation
 *  @param {string}      mobileNo
 *  @param {string}      token
 * 
 * 
 * @returns {Object}
 */
exports.insertComplaint = [
	body("mobileNo").isLength({ min: 1 }).trim().withMessage("Mobile Number must be specified.")
		.isNumeric().withMessage("Mobile No must be a valid Number."),
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),
	body("complaintTitle").isLength({ min: 1 }).trim().withMessage("ComplaintTitle must be specified."),
	body("complaintDescription").isLength({ min: 1 }).trim().withMessage("ComplaintDescription must be specified."),
	body("complaintLocation").isLength({ min: 1 }).trim().withMessage("ComplaintLocation must be specified."),
	sanitizeBody("complaintTitle").escape(),
	sanitizeBody("complaintDescription").escape(),
	sanitizeBody("complaintLocation").escape(),
	sanitizeBody("mobileNo").escape(),
	sanitizeBody("token").escape(),
	
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				UserModel.findOne({$and:[{mobileNo : req.body.mobileNo},{token : req.body.token}]}).then(user => {
					if (user) {
						
							
								
									if(user.status) {
										let date_ob = new Date();

										// current date
										// adjust 0 before single digit date
										let date = ("0" + date_ob.getDate()).slice(-2);

										// current month
										let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

										// current year
										let year = date_ob.getFullYear();

										// current hours
										let hours = date_ob.getHours();

										// current minutes
										let minutes = date_ob.getMinutes();

										// current seconds
										let seconds = date_ob.getSeconds();
										
										
										var complaint = new ComplaintModel(
												{
													complaintTitle: req.body.complaintTitle,
													complaintNumber:year+""+month+""+date+""+hours+""+minutes+""+seconds,
													complaintDescription: req.body.complaintDescription,
													complaintReportType: req.body.complaintReportType,
													complaintLocation:req.body.complaintLocation,
													complaintDepartmentName:req.body.complaintDepartmentName,
													complaintFileNames:req.body.complaintFileNames,
													complaintCreatedBy:user._id,
													complaintPublish:'',
													complaintStatus:"Pending"
													
												}
											);
										complaint.save(function (err) {
											if (err) { return apiResponse.ErrorResponse(res, err); }
											
											return apiResponse.successResponseWithData(res,"Complaint Inseted.", complaint);
										});
										
									}else {
										return apiResponse.unauthorizedResponse(res, "Account is not active. Please contact admin.");
									}
								
							
						
					}else{
						return apiResponse.unauthorizedResponse(res, "Mobile Number or Token wrong.");
					}
				});
			}
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}];


/**
 *  Complaints.
 * 
 
  *  @param {string}      mobileNo
 *  @param {string}      token
 * 
 * 
 * @returns {Object}
 */
exports.complaints = [
	body("mobileNo").isLength({ min: 1 }).trim().withMessage("Mobile Number must be specified.")
		.isNumeric().withMessage("Mobile No must be a valid Number."),
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),

	sanitizeBody("mobileNo").escape(),
	sanitizeBody("token").escape(),
	

	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				UserModel.findOne({$and:[{mobileNo : req.body.mobileNo},{token : req.body.token}]}).then(user => {
					if (user) {
						
							
								
									if(user.status) {
									
										ComplaintModel.find({complaintCreatedBy:user._id}).sort({_id:-1}).then(complaints => {
											if (complaints.length>0) {
												
													
												return apiResponse.successResponseWithData(res,"Complaints Success.", complaints);
													
												
											}else{
												
												return apiResponse.successResponse(res,"No Complaint Details.");
												
											}
										});
										
									}else {
										return apiResponse.unauthorizedResponse(res, "Account is not active. Please contact admin.");
									}
								
							
						
					}else{
						return apiResponse.unauthorizedResponse(res, "Mobile Number or Token wrong.");
					}
				});
			}
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}];


/**
 *   Complaint.
 * 
 
  *  @param {string}      mobileNo
 *  @param {string}      token
 * 
 * 
 * @returns {Object}
 */
exports.complaint = [
/*	body("mobileNo").isLength({ min: 1 }).trim().withMessage("Mobile Number must be specified.")
		.isNumeric().withMessage("Mobile No must be a valid Number."),
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),*/
	body("complaintId").isLength({ min: 1 }).trim().withMessage("Complaint Id must be specified."),

//	sanitizeBody("mobileNo").escape(),
//	sanitizeBody("token").escape(),
	sanitizeBody("complaintId").escape(),
	

	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
/*				UserModel.findOne({$and:[{mobileNo : req.body.mobileNo},{token : req.body.token}]}).then(user => {
					if (user) {
						
							
								
									if(user.status) {*/
									
										ComplaintModel.findOne({_id:req.body.complaintId}).then(complaint => {
											if (complaint) {
												
												DepartmentModel.findOne({_id:complaint.complaintDepartmentName}).then(dept => {
													if (dept) {

														ComplaintLogModel.find({complaintId:req.body.complaintId}).then(complaintLogs => {
															if (complaintLogs.length>0) {
																let complaintDetails={
																		_id: complaint._id,
																		status:complaint.status,
																		complaintTitle:complaint.complaintTitle,
																		complaintNumber:complaint.complaintNumber,
																		complaintPublish:complaint.complaintPublish,
																		complaintStatus:complaint.complaintStatus,
																		complaintReplyDescription:complaint.complaintReplyDescription,
																		complaintReplyBy:complaint.complaintReplyBy,
																		complaintCreatedBy:complaint.complaintCreatedBy,
																		complaintDescription:complaint.complaintDescription,
																		complaintLocation:complaint.complaintLocation,
																		complaintFileNames:complaint.complaintFileNames,
																		complaintDepartmentName:dept,
																		updatedAt:complaint.updatedAt,
																		
																		logs:complaintLogs,
																		complaintStatus:complaint.complaintStatus,
																		createdAt:complaint.createdAt,
																		
																		
																};
																return apiResponse.successResponseWithData(res,"Complaint Success.", complaintDetails);
															}
															else
																{
																let complaintDetails={
																		_id: complaint._id,
																		status:complaint.status,
																		complaintTitle:complaint.complaintTitle,
																		complaintNumber:complaint.complaintNumber,
																		complaintPublish:complaint.complaintPublish,
																		complaintStatus:complaint.complaintStatus,
																		complaintReplyDescription:complaint.complaintReplyDescription,
																		complaintReplyBy:complaint.complaintReplyBy,
																		complaintCreatedBy:complaint.complaintCreatedBy,
																		complaintDescription:complaint.complaintDescription,
																		complaintLocation:complaint.complaintLocation,
																		complaintFileNames:complaint.complaintFileNames,
																		complaintDepartmentName:dept,
																		updatedAt:complaint.updatedAt,
																		
																		logs:[],
																		complaintStatus:complaint.complaintStatus,
																		createdAt:complaint.createdAt,
																		
																		
																};
																return apiResponse.successResponseWithData(res,"Complaint Success.", complaintDetails);
																}
														
														});
														
														
														
													}else{
														
														return apiResponse.successResponse(res,"No Complaint Details.");
														
													}
												});
												
												
												
											}else{
												
												return apiResponse.successResponse(res,"No Complaint Details.");
												
											}
										});
										
			/*						}else {
										return apiResponse.unauthorizedResponse(res, "Account is not active. Please contact admin.");
									}
								
							
						
					}else{
						return apiResponse.unauthorizedResponse(res, "Mobile Number or Token wrong.");
					}
				});*/
			}
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}];


/**
 *   Complaint.
 * 
 
  *  @param {string}      mobileNo
 *  @param {string}      token
 * 
 * 
 * @returns {Object}
 */
exports.complaintNumber = [
	body("mobileNo").isLength({ min: 1 }).trim().withMessage("Mobile Number must be specified.")
		.isNumeric().withMessage("Mobile No must be a valid Number."),
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),
	body("complaintNumber").isLength({ min: 1 }).trim().withMessage("Complaint Id must be specified."),

	sanitizeBody("mobileNo").escape(),
	sanitizeBody("token").escape(),
	sanitizeBody("complaintNumber").escape(),
	

	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				UserModel.findOne({$and:[{mobileNo : req.body.mobileNo},{token : req.body.token}]}).then(user => {
					if (user) {
						
							
								
									if(user.status) {
									
										ComplaintModel.findOne({complaintNumber:req.body.complaintNumber}).then(complaint => {
											if (complaint) {
												
												ComplaintLogModel.find({complaintId:req.body.complaintId}).then(complaintLogs => {
													if (complaintLogs.length>0) {
														let complaintDetails={
																_id: complaint._id,
																status:complaint.status,
																complaintTitle:complaint.complaintTitle,
																complaintNumber:complaint.complaintNumber,
																complaintPublish:complaint.complaintPublish,
																complaintStatus:complaint.complaintStatus,
																complaintReplyDescription:complaint.complaintReplyDescription,
																complaintReplyBy:complaint.complaintReplyBy,
																complaintCreatedBy:complaint.complaintCreatedBy,
																complaintDescription:complaint.complaintDescription,
																complaintLocation:complaint.complaintLocation,
																complaintFileNames:complaint.complaintFileNames,
																complaintDepartmentName:complaint.complaintDepartmentName,
																updatedAt:complaint.updatedAt,
																
																logs:complaintLogs,
																complaintStatus:complaint.complaintStatus,
																createdAt:complaint.createdAt,
																
																
														};
														return apiResponse.successResponseWithData(res,"Complaint Success.", complaintDetails);
													}
													else
														{
														let complaintDetails={
																_id: complaint._id,
																status:complaint.status,
																complaintTitle:complaint.complaintTitle,
																complaintNumber:complaint.complaintNumber,
																complaintPublish:complaint.complaintPublish,
																complaintStatus:complaint.complaintStatus,
																complaintReplyDescription:complaint.complaintReplyDescription,
																complaintReplyBy:complaint.complaintReplyBy,
																complaintCreatedBy:complaint.complaintCreatedBy,
																complaintDescription:complaint.complaintDescription,
																complaintLocation:complaint.complaintLocation,
																complaintFileNames:complaint.complaintFileNames,
																complaintDepartmentName:complaint.complaintDepartmentName,
																updatedAt:complaint.updatedAt,
																
																logs:[],
																complaintStatus:complaint.complaintStatus,
																createdAt:complaint.createdAt,
																
																
														};
														return apiResponse.successResponseWithData(res,"Complaint Success.", complaintDetails);
														}
												
												});
												
											}else{
												
												return apiResponse.successResponse(res,"No Complaint Details.");
												
											}
										});
										
									}else {
										return apiResponse.unauthorizedResponse(res, "Account is not active. Please contact admin.");
									}
								
							
						
					}else{
						return apiResponse.unauthorizedResponse(res, "Mobile Number or Token wrong.");
					}
				});
			}
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}];



/**
 *  Complaint.
 * 
 
  *  @param {string}      mobileNo
 *  @param {string}      token
 * 
 * 
 * @returns {Object}
 */
exports.complaintUpdate = [
	body("mobileNo").isLength({ min: 1 }).trim().withMessage("Mobile Number must be specified.")
		.isNumeric().withMessage("Mobile No must be a valid Number."),
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),
	body("complaintId").isLength({ min: 1 }).trim().withMessage("Complaint Id must be specified."),
	body("complaintTitle").isLength({ min: 1 }).trim().withMessage("ComplaintTitle must be specified."),
	body("complaintDescription").isLength({ min: 1 }).trim().withMessage("ComplaintDescription must be specified."),
	body("complaintLocation").isLength({ min: 1 }).trim().withMessage("ComplaintLocation must be specified."),
	sanitizeBody("complaintTitle").escape(),
	sanitizeBody("complaintDescription").escape(),
	sanitizeBody("complaintLocation").escape(),
	sanitizeBody("mobileNo").escape(),
	sanitizeBody("token").escape(),
	sanitizeBody("complaintId").escape(),
	

	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				UserModel.findOne({$and:[{mobileNo : req.body.mobileNo},{token : req.body.token}]}).then(user => {
					if (user) {
						
							
								
									if(user.status) {
									
										ComplaintModel.findOne({_id:req.body.complaintId}).then(complaint => {
											if (complaint) {
												
													
											
												complaint.complaintTitle= req.body.complaintTitle;
												complaint.complaintDescription= req.body.complaintDescription;
												complaint.complaintReportType= req.body.complaintReportType;
												complaint.complaintLocation=req.body.complaintLocation;
												complaint.complaintStatus="Pending";
												complaint.complaintDepartmentName=req.body.complaintDepartmentName;
												complaint.complaintFileNames=req.body.complaintFileNames;
													
												complaint.save(function (err) {
													if (err) { return apiResponse.ErrorResponse(res, err); }
													
													return apiResponse.successResponseWithData(res,"Complaint Updated.", complaint);
												});	
												
											}else{
												
												return apiResponse.successResponse(res,"No Complaint Details.");
												
											}
										});
										
									}else {
										return apiResponse.unauthorizedResponse(res, "Account is not active. Please contact admin.");
									}
								
							
						
					}else{
						return apiResponse.unauthorizedResponse(res, "Mobile Number or Token wrong.");
					}
				});
			}
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}];

/**
 * MLA Update Profile.
 * 
 * @param {string}
 *            mobileNoAdmin
 
 * @param {string}
 *            token
 * 
 * 
 * 
 * @returns {Object}
 */
exports.mlaProfile = [

//	body("mobileNo").isLength({ min: 1 }).trim().withMessage("Username must be specified.")
//		.isNumeric().withMessage("Username must be a valid Number."),
	
//	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),

	sanitizeBody("mobileNo").escape(),
	sanitizeBody("token").escape(),
	
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				//UserModel.findOne({$and:[{mobileNo : req.body.mobileNo},{token : req.body.token}]}).then(user => {
				//	if (user) {
				MLAModel.find().then(mla => {
					if (mla.length>0) {
						
							
						return apiResponse.successResponseWithData(res,"MLA Details Success.", mla[0]);
							
						
					}else{
						
						return apiResponse.successResponse(res,"No MLA Details.");
						
					}
				});
		/*	}
					else{
						return apiResponse.unauthorizedResponse(res, "Mobile Number or Token wrong.");
					}
				});*/
					
		}
				
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}];

/**
 * Home Event Details.
 * 
 * @returns {Object}
 */
exports.HomeEventDetails = [

	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			} else {

				let eventDetails = {
					title: '5th ANNUAL MEET',
					title_color: '#843b07',
					subtitle: 'On sunday 8th May, 2022',
					subtitle_color: 'black',
					timing: '1:30PM - 6:00PM',
					venue: 'KLN Prasad Auditorium',
					address: 'Telangana Chamber of Commerce and Industry, FTCCI Marg, Lakdikapul Rd, Hari Nagar, Red Hills, Hyderabad.(T.S)',
					image: '1651856984206event-mhf.png'
				};
				return apiResponse.successResponseWithData(res, "Home Event Details", eventDetails);

			}

		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}];



/**
 * EventProjects.
 * 
 * @param {string}
 *            mobileNo
 
 * @param {string}
 *            token
  @param {string}
 *            eventProjectType
 * 
 * 
 * 
 * @returns {Object}
 */
exports.eventProjects = [

/*	body("mobileNo").isLength({ min: 1 }).trim().withMessage("Username must be specified.")
		.isNumeric().withMessage("Username must be a valid Number."),
	
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),*/
	body("eventProjectType").isLength({ min: 1 }).trim().withMessage("eventProjectType must be specified."),

//	sanitizeBody("mobileNo").escape(),
//	sanitizeBody("token").escape(),
	sanitizeBody("eventProjectType").escape(),
	
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
/*				UserModel.findOne({$and:[{mobileNo : req.body.mobileNo},{token : req.body.token}]}).then(user => {
					if (user) {*/
						EventProjectModel.find({$and:[{eventProjectType:req.body.eventProjectType},{status:true}]}).sort({eventProjectDate:-1}).then(eventProjects => {
					if (eventProjects.length>0) {
						
							
						return apiResponse.successResponseWithData(res,req.body.eventProjectType+" Success.", eventProjects);
							
						
					}else{
						
						return apiResponse.successResponse(res,"No "+req.body.eventProjectType+" Details.");
						
					}
				});
		/*	}
					else{
						return apiResponse.unauthorizedResponse(res, "Mobile Number or Token wrong.");
					}
				});*/
					
		}
				
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}];

/**
 * EventProjects.
 * 
 * @param {string}
 *            mobileNo
 
 * @param {string}
 *            token
  @param {string}
 *            eventProjectType
 * 
 * @param {string}
 *            limits
 * 
 * 
 * 
 * @returns {Object}
 */
exports.eventProjectsLimits = [

/*	body("mobileNo").isLength({ min: 1 }).trim().withMessage("Username must be specified.")
		.isNumeric().withMessage("Username must be a valid Number."),
	
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),*/
	body("eventProjectType").isLength({ min: 1 }).trim().withMessage("eventProjectType must be specified."),
	body("limit").isLength({ min: 1 }).trim().withMessage("Limit must be specified."),

	sanitizeBody("limit").escape(),
//	sanitizeBody("mobileNo").escape(),
//	sanitizeBody("token").escape(),
	sanitizeBody("eventProjectType").escape(),
	
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
/*				UserModel.findOne({$and:[{mobileNo : req.body.mobileNo},{token : req.body.token}]}).then(user => {
					if (user) {*/
						EventProjectModel.find({$and:[{eventProjectType:req.body.eventProjectType},{status:true}]}).sort({eventProjectDate:-1}).then(eventProjects => {
					if (eventProjects.length>0) {
						
							
						return apiResponse.successResponseWithData(res,req.body.eventProjectType+" Success.", eventProjects.slice(0,req.body.limit));
							
						
					}else{
						
						return apiResponse.successResponse(res,"No "+req.body.eventProjectType+" Details.");
						
					}
				});
			/*}
					else{
						return apiResponse.unauthorizedResponse(res, "Mobile Number or Token wrong.");
					}
				});*/
					
		}
				
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}];
/**
 * EventProject.
 * 
 * @param {string}
 *            mobileNo
 
 * @param {string}
 *            token
  @param {string}
 *            eventProjectId
 * 
 * 
 * 
 * @returns {Object}
 */
exports.eventProject = [

/*	body("mobileNo").isLength({ min: 1 }).trim().withMessage("Username must be specified.")
		.isNumeric().withMessage("Username must be a valid Number."),
	
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),*/
	body("eventProjectId").isLength({ min: 1 }).trim().withMessage("eventProjectTypeId must be specified."),

//	sanitizeBody("mobileNo").escape(),
//	sanitizeBody("token").escape(),
	sanitizeBody("eventProjectType").escape(),
	
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
/*				UserModel.findOne({$and:[{mobileNo : req.body.mobileNo},{token : req.body.token}]}).then(user => {
					if (user) {*/
						EventProjectModel.findOne({_id:req.body.eventProjectId}).then(eventProject => {
					if (eventProject) {
						
							
						return apiResponse.successResponseWithData(res,eventProject.eventProjectType+" Success.", eventProject);
							
						
					}else{
						
						return apiResponse.successResponse(res,"No "+req.body.eventProjectId+" Details.");
						
					}
				});
		/*	}
					else{
						return apiResponse.unauthorizedResponse(res, "Mobile Number or Token wrong.");
					}
				});*/
					
		}
				
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}];

/**
 * ContactNumber.
 * 
 * @param {string}
 *            mobileNoAdmin
 
 * @param {string}
 *            token
  @param {string}
 *            eventProjectType
 * 
 * 
 * 
 * @returns {Object}
 */
exports.contactNumbers = [

/*	body("mobileNo").isLength({ min: 1 }).trim().withMessage("Username must be specified.")
		.isNumeric().withMessage("Username must be a valid Number."),
	
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),

	sanitizeBody("mobileNo").escape(),
	sanitizeBody("token").escape(),
*/
	
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
/*				UserModel.findOne({$and:[{mobileNo : req.body.mobileNo},{token : req.body.token}]}).then(user => {
					if (user) {*/
						ContactNumberModel.find({headOfService:""}).sort({_id:-1}).then(contactNumbers => {
					if (contactNumbers.length>0) {
						
							
						return apiResponse.successResponseWithData(res,"Contact Numbers Success.", contactNumbers);
							
						
					}else{
						
						return apiResponse.successResponse(res,"No Contact Numbers Details.");
						
					}
				});
		/*	}
					else{
						return apiResponse.unauthorizedResponse(res, "Mobile Number or Token wrong.");
					}
				});*/
					
		}
				
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}];

/**
 * contactNumbersHeadOfService.
 * 
 * @param {string}
 *            mobileNoAdmin
 
 * @param {string}
 *            token

 * 
 * 
 * @returns {Object}
 */
exports.contactNumbersHeadOfService = [

/*	body("mobileNo").isLength({ min: 1 }).trim().withMessage("Username must be specified.")
		.isNumeric().withMessage("Username must be a valid Number."),
	
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),

	sanitizeBody("mobileNo").escape(),
	sanitizeBody("token").escape(),
*/
	
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
/*				UserModel.findOne({$and:[{mobileNo : req.body.mobileNo},{token : req.body.token}]}).then(user => {
					if (user) {*/
						ContactNumberModel.find({headOfService:"headOfService"}).sort({_id:-1}).then(contactNumbers => {
					if (contactNumbers.length>0) {
						
							
						return apiResponse.successResponseWithData(res,"Contact Numbers Success.", contactNumbers);
							
						
					}else{
						
						return apiResponse.successResponse(res,"No Contact Numbers Details.");
						
					}
				});
			/*}
					else{
						return apiResponse.unauthorizedResponse(res, "Mobile Number or Token wrong.");
					}
				});*/
					
		}
				
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}];

/**
* Contact Us 
* 
* @param {string}
*            mobileNo

* @param {string}
*            token
* 
* 
* 
* @returns {Object}
*/
exports.contactUs = [

/*	body("mobileNo").isLength({ min: 1 }).trim().withMessage("Username must be specified.")
		.isNumeric().withMessage("Username must be a valid Number."),
	
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),

	sanitizeBody("mobileNo").escape(),
	sanitizeBody("token").escape(),
*/	
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
/*				UserModel.findOne({$and:[{mobileNo : req.body.mobileNo},{token : req.body.token}]}).then(user => {
					if (user) {*/
				ContactUsModel.find().then(contactUs => {
					if (contactUs.length>0) {
						
							
						return apiResponse.successResponseWithData(res,"ContactUs Details Success.", contactUs[0]);
							
						
					}else{
						
						return apiResponse.successResponse(res,"No ContactUs Details.");
						
					}
				});
		/*	}
					else{
						return apiResponse.unauthorizedResponse(res, "Mobile Number or Token wrong.");
					}
				});*/
					
		}
				
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}];

/**
 * Social media Linkings.
 * 
 * @param {string}
 *            mobileNo
 
 * @param {string}
 *            token
  @param {string}
 *            eventProjectType
 * 
 * 
 * 
 * @returns {Object}
 */
exports.socialMediaLinkings = [

	body("mobileNo").isLength({ min: 1 }).trim().withMessage("Username must be specified.")
		.isNumeric().withMessage("Username must be a valid Number."),
	
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),

	sanitizeBody("mobileNo").escape(),
	sanitizeBody("token").escape(),

	
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				UserModel.findOne({$and:[{mobileNo : req.body.mobileNo},{token : req.body.token}]}).then(user => {
					if (user) {
						SocialMediaLinkingModel.find().then(socialMediaLinkings => {
					if (socialMediaLinkings.length>0) {
						
							
						return apiResponse.successResponseWithData(res,"SocialMedia Linkings Success.", socialMediaLinkings);
							
						
					}else{
						
						return apiResponse.successResponse(res,"No SocialMedia Linking Details.");
						
					}
				});
			}
					else{
						return apiResponse.unauthorizedResponse(res, "Mobile Number or Token wrong.");
					}
				});
					
		}
				
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}];

/**
 *  Complaints.
 * 
 
  *  @param {string}      mobileNo
 *  @param {string}      token
 * 
 * 
 * @returns {Object}
 */
exports.complaintsPublish = [
/*	body("mobileNo").isLength({ min: 1 }).trim().withMessage("Mobile Number must be specified.")
		.isNumeric().withMessage("Mobile No must be a valid Number."),
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),*/
	body("complaintPublish").isLength({ min: 1 }).trim().withMessage("Token must be specified."),
	
//	sanitizeBody("mobileNo").escape(),
//	sanitizeBody("token").escape(),
	sanitizeBody("complaintPublish").escape(),
	

	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
/*				UserModel.findOne({$and:[{mobileNo : req.body.mobileNo},{token : req.body.token}]}).then(user => {
					if (user) {
						
							
								
									if(user.status) {*/
									
										ComplaintModel.find({complaintPublish:req.body.complaintPublish}).sort({_id:-1}).then(complaints => {
											if (complaints.length>0) {
												
													
												return apiResponse.successResponseWithData(res,"Complaints Success.", complaints);
													
												
											}else{
												
												return apiResponse.successResponse(res,"No Complaint Details.");
												
											}
										});
										
/*									}else {
										return apiResponse.unauthorizedResponse(res, "Account is not active. Please contact admin.");
									}
								
							
						
					}else{
						return apiResponse.unauthorizedResponse(res, "Mobile Number or Token wrong.");
					}
				});*/
			}
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}];


/**
 * Departments.
 * 
 * @param {string}
 *            mobileNo
 
 * @param {string}
 *            token
 * 
 * 
 * 
 * @returns {Object}
 */
exports.departments = [

	body("mobileNo").isLength({ min: 1 }).trim().withMessage("Username must be specified.")
		.isNumeric().withMessage("Username must be a valid Number."),
	
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),

	sanitizeBody("mobileNo").escape(),
	sanitizeBody("token").escape(),

	
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				UserModel.findOne({$and:[{mobileNo : req.body.mobileNo},{token : req.body.token}]}).then(user => {
					if (user) {
						DepartmentModel.find({status: true}).then(depts => {
							if (depts.length>0) {
								
									
								return apiResponse.successResponseWithData(res,"Departments Success.", depts);
									
								
							}else{
								
								return apiResponse.successResponse(res,"No Department Details.");
								
							}
				});
			}
					else{
						return apiResponse.unauthorizedResponse(res, "Mobile Number or Token wrong.");
					}
				});
					
		}
				
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}];


/**
 * Albums.
 * 
 * @param {string}
 *            mobileNo
 
 * @param {string}
 *            token
 * 
 * 
 * 
 * @returns {Object}
 */
exports.albums = [

/*	body("mobileNo").isLength({ min: 1 }).trim().withMessage("Username must be specified.")
		.isNumeric().withMessage("Username must be a valid Number."),
	
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),*/
	body("limit").isLength({ min: 1 }).trim().withMessage("Limit must be specified."),

	sanitizeBody("limit").escape(),
//	sanitizeBody("mobileNo").escape(),
//	sanitizeBody("token").escape(),
	
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
/*				UserModel.findOne({$and:[{mobileNo : req.body.mobileNo},{token : req.body.token}]}).then(user => {
					if (user) {*/
						AlbumModel.find({albumstatus:true}).sort({_id:-1}).then(albums => {
					if (albums.length>0) {
						
							
						return apiResponse.successResponseWithData(res,"Albums Success.", albums.slice(0,req.body.limit));
							
						
					}else{
						
						return apiResponse.successResponse(res,"No Albums Details.");
						
					}
				});
/*			}
					else{
						return apiResponse.unauthorizedResponse(res, "Mobile Number or Token wrong.");
					}
				});*/
					
		}
				
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}];

/**
 * Albums.
 * 
 * @param {string}
 *            mobileNo
 
 * @param {string}
 *            token
 * 
 * 
 * 
 * @returns {Object}
 */
exports.album = [

	body("mobileNo").isLength({ min: 1 }).trim().withMessage("Username must be specified.")
		.isNumeric().withMessage("Username must be a valid Number."),
	
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),
	body("albumId").isLength({ min: 1 }).trim().withMessage("albumFiles must be specified."),
	sanitizeBody("albumId").escape(),
	sanitizeBody("mobileNo").escape(),
	sanitizeBody("token").escape(),
	
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				UserModel.findOne({$and:[{mobileNo : req.body.mobileNo},{token : req.body.token}]}).then(user => {
					if (user) {
						AlbumModel.find({_id:req.body.albumId}).then(album => {
					if (album) {
						
							
						return apiResponse.successResponseWithData(res,"Album Success.", album);
							
						
					}else{
						
						return apiResponse.successResponse(res,"No Album Details.");
						
					}
				});
			}
					else{
						return apiResponse.unauthorizedResponse(res, "Mobile Number or Token wrong.");
					}
				});
					
		}
				
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}];


	/**
 * Donation Order.
 * 
 * @param {string}
 *            mobileNo
 
 * @param {string}
 *            token
 * 
 * 
 * 
 * @returns {Object}
 */
exports.createDonationOrder = [

	body("mobileNo").isLength({ min: 1 }).trim().withMessage("Username must be specified.")
		.isNumeric().withMessage("Username must be a valid Number."),
	
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),
	body("albumId").isLength({ min: 1 }).trim().withMessage("albumFiles must be specified."),
	sanitizeBody("albumId").escape(),
	sanitizeBody("mobileNo").escape(),
	sanitizeBody("token").escape(),
	
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				UserModel.findOne({$and:[{mobileNo : req.body.mobileNo},{token : req.body.token}]}).then(user => {
					if (user) {
						AlbumModel.find({_id:req.body.albumId}).then(album => {
					if (album) {
						
							
						return apiResponse.successResponseWithData(res,"Album Success.", album);
							
						
					}else{
						
						return apiResponse.successResponse(res,"No Album Details.");
						
					}
				});
			}
					else{
						return apiResponse.unauthorizedResponse(res, "Mobile Number or Token wrong.");
					}
				});
					
		}
				
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}];






