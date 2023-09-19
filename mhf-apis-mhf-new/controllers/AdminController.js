const AdminModel = require("../models/AdminModel");
const MLAModel = require("../models/MLAModel");
const DepartmentModel = require("../models/DepartmentModel");
const SubDepartmentModel = require("../models/SubDepartmentModel");
const EventProjectModel = require("../models/EventProjectModel");
const ContactNumberModel = require("../models/ContactNumberModel");
const ContactUsModel = require("../models/ContactUsModel");
const SocialMediaLinkingModel = require("../models/SocialMediaLinkingModel");
const ComplaintModel = require("../models/ComplaintModel");
const UserModel = require("../models/UserModel");
const UserHistoryModel = require("../models/UserHistoryModel");
const ComplaintLogModel = require("../models/ComplaintLogModel");
const AlbumModel = require("../models/AlbumModel");
const FamilyMembersModel = require("../models/FamilyMembersModel");
const PaymentsModel = require("../models/PaymentsModel");
const DoctorModel = require("../models/doctorModel");
const HospitalModel = require("../models/hospitalModel");
const MembershipHistory = require("../models/MembershipHistoryModel");
const { body,validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
// helper file to prepare responses.
const apiResponse = require("../helpers/apiResponse");
const utility = require("../helpers/utility");
// const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailer = require("../helpers/mailer");
const { constants } = require("../helpers/constants");
const https = require('https');
const CircularJSON = require('circular-json');

const http = require('http');
const moment = require('moment');

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
				AdminModel.findOne(query).then(admin => {
					if (admin) {
					
							// Generate otp
							let otp = utility.randomNumber(4);
							// if(req.body.mobileNo=="7540050507" || req.body.mobileNo=="8610170306")
							// {
							// 	otp="1234";
							// }
							let otpLink = utility.otpLink(req.body.mobileNo,otp);
							http.get(otpLink, (resp) => {
								  let data = '';

								//   // A chunk of data has been recieved.
								//   resp.on('data', (chunk) => {
								//     data += chunk;
								//   });

								//   // The whole response has been received.
								// 	// Print out the result.
								//   resp.on('end', () => {
								//     console.log(JSON.parse(data).explanation);
								//   });

								}).on("error", (err) => {
								  console.log("Error: " + err.message);
								  
								});
							admin.confirmOTP = otp;
							// Save admin.
							admin.save(function (err) {
								if (err) { return apiResponse.ErrorResponse(res, err); }
								return apiResponse.successResponseWithData(res,"Confirm otp sent.",admin);
							});
						
					}else{
						
							
						return apiResponse.unauthorizedResponse(res, "Email or Password wrong.");
					
					}
				});
			}
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}];



/**
 * Admin login.
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
				AdminModel.findOne({mobileNo : req.body.mobileNo}).then(admin => {
					if (admin) {
						
							if(admin.confirmOTP == req.body.otp){
								
									if(admin.status) {
										let adminData = {
											_id: admin._id,
											fullName: admin.fullName,
											mobileNo: admin.mobileNo,
											confirmOTP: admin.confirmOTP,
											
										};
										// Prepare JWT token for authentication
										const jwtPayload = adminData;
										const jwtData = {
											expiresIn: process.env.JWT_TIMEOUT_DURATION,
										};
										const secret = process.env.JWT_SECRET;
										// Generated JWT token with Payload and
										// secret.
										adminData.token = jwt.sign(jwtPayload, secret, jwtData);
										admin.token=adminData.token;
										admin.save(function (err) {
											if (err) { return apiResponse.ErrorResponse(res, err); }
											return apiResponse.successResponseWithData(res,"Login Success.", adminData);
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
 * MLA Update Profile.
 * 
 * @param {string}
 *            mobileNoAdmin
 * 
 * @param {string}
 *            token
 * 
 * 
 * 
 * @returns {Object}
 */
exports.mlaProfile = [

	body("mobileNoAdmin").isLength({ min: 1 }).trim().withMessage("Username must be specified.")
		.isNumeric().withMessage("Username must be a valid Number."),
	
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),

	sanitizeBody("mobileNoAdmin").escape(),
	sanitizeBody("token").escape(),
	
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				AdminModel.findOne({$and:[{mobileNo : req.body.mobileNoAdmin},{token : req.body.token}]}).then(admin => {
					if (admin) {
				MLAModel.find().then(mla => {
					if (mla.length>0) {
						
							
						return apiResponse.successResponseWithData(res,"MLA Details Success.", mla[0]);
							
						
					}else{
						
						return apiResponse.successResponse(res,"No MLA Details.");
						
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
 * MLA Update Profile.
 * 
 * @param {string}
 *            mobileNo
 * @param {string}
 *            fullName
 * @param {string}
 *            mobileNo
 * @param {string}
 *            qualification
 * @param {string}
 *            aboutMLA
 * @param {string}
 *            adminPhoto
 * 
 * 
 * 
 * @returns {Object}
 */
exports.updateMLAProfile = [
	body("mobileNo").isLength({ min: 1 }).trim().withMessage("Contact Number must be specified.")
		.isNumeric().withMessage("Contact No must be a valid Number."),
	body("mobileNoAdmin").isLength({ min: 1 }).trim().withMessage("Username must be specified.")
		.isNumeric().withMessage("Username must be a valid Number."),
	// body("voterId").isLength({ min: 1 }).trim().withMessage("Voter Id must be
	// specified.")
		// .isAlphanumeric().withMessage("Voter Id has non-alphanumeric
		// characters."),
	body("fullName").isLength({ min: 1 }).trim().withMessage("Name must be specified."),
	// .isAlphanumeric().withMessage("Name has non-alphanumeric characters."),
	body("qualification").isLength({ min: 1 }).trim().withMessage("Qualification be specified."),
	body("aboutMLA").isLength({ min: 1 }).trim().withMessage("About MLA must be specified."),
	body("mlaPhoto").isLength({ min: 1 }).trim().withMessage("MLA Photo be specified."),
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),
	sanitizeBody("mobileNo").escape(),
	sanitizeBody("mobileNoAdmin").escape(),
	sanitizeBody("token").escape(),
	sanitizeBody("fullName").escape(),
	sanitizeBody("qualification").escape(),
	sanitizeBody("aboutMLA").escape(),
	sanitizeBody("mlaPhoto").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				AdminModel.findOne({$and:[{mobileNo : req.body.mobileNoAdmin},{token : req.body.token}]}).then(admin => {
					if (admin) {
				MLAModel.find().then(mlas => {
					if (mlas.length>0) {
						
						mla=mlas[0];
								
									if(mla.status) {
										mla.fullName=req.body.fullName;
										mla.mobileNo=req.body.mobileNo;
										mla.qualification= decodeURIComponent(req.body.qualification);
										mla.aboutMLA= decodeURIComponent(req.body.aboutMLA);
										mla.mlaPhoto=req.body.mlaPhoto;
										mla.save(function (err) {
											if (err) { return apiResponse.ErrorResponse(res, err); }
											return apiResponse.successResponseWithData(res,"Updated Success.", mla);
										});
										
									}else {
										return apiResponse.unauthorizedResponse(res, "MLA is not active. Please contact admin.");
									}
								
							
						
					}else{
						
						var mla = new MLAModel(
								{
									fullName:req.body.fullName,
									mobileNo:req.body.mobileNo,
									qualification:req.body.qualification,
									aboutMLA:req.body.aboutMLA,
									mlaPhoto:req.body.mlaPhoto
								}
							);
						
						mla.save(function (err) {
							if (err) { return apiResponse.ErrorResponse(res, err); }
							return apiResponse.successResponseWithData(res,"Updated Success.", mla);
						});
						
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
 * Add Departments.
 * 
 * @param {string}
 *            mobileNoAdmin
 * @param {string}
 *            departmentName
 * 
 * @param {string}
 *            token
 * 
 * 
 * 
 * @returns {Object}
 */
exports.insertDepartment = [

	body("mobileNoAdmin").isLength({ min: 1 }).trim().withMessage("Username must be specified.")
		.isNumeric().withMessage("Username must be a valid Number."),
	
	
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),
	body("departmentName").isLength({ min: 1 }).trim().withMessage("departmentName must be specified."),
	sanitizeBody("departmentName").escape(),
	sanitizeBody("mobileNoAdmin").escape(),
	sanitizeBody("token").escape(),
	
	
	
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				AdminModel.findOne({$and:[{mobileNo : req.body.mobileNoAdmin},{token : req.body.token}]}).then(admin => {
					if (admin) {
						var dept = new DepartmentModel(
								{
									departmentName: decodeURIComponent(req.body.departmentName),
									departmentCreatedBy: admin._id
									
								}
							);
						dept.save(function (err) {
							if (err) { return apiResponse.ErrorResponse(res, err); }
							
							return apiResponse.successResponseWithData(res,"Department Inseted.", dept);
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
 * Departments.
 * 
 * @param {string}
 *            mobileNoAdmin
 * 
 * @param {string}
 *            token
 * 
 * 
 * 
 * @returns {Object}
 */
exports.departments = [

	body("mobileNoAdmin").isLength({ min: 1 }).trim().withMessage("Username must be specified.")
		.isNumeric().withMessage("Username must be a valid Number."),
	
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),

	sanitizeBody("mobileNoAdmin").escape(),
	sanitizeBody("token").escape(),
	
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				AdminModel.findOne({$and:[{mobileNo : req.body.mobileNoAdmin},{token : req.body.token}]}).then(admin => {
					if (admin) {
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
 * Department.
 * 
 * @param {string}
 *            mobileNoAdmin
 * 
 * @param {string}
 *            token
 * @param {string}
 *            deptId
 * 
 * 
 * 
 * @returns {Object}
 */
exports.department = [

	body("mobileNoAdmin").isLength({ min: 1 }).trim().withMessage("Username must be specified.")
		.isNumeric().withMessage("Username must be a valid Number."),
	
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),
	body("departmentId").isLength({ min: 1 }).trim().withMessage("Ddepartment Id must be specified."),

	sanitizeBody("mobileNoAdmin").escape(),
	sanitizeBody("token").escape(),
	sanitizeBody("departmentId").escape(),
	
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				AdminModel.findOne({$and:[{mobileNo : req.body.mobileNoAdmin},{token : req.body.token}]}).then(admin => {
					if (admin) {
						DepartmentModel.findOne({_id:req.body.departmentId}).then(dept => {
					if (dept) {
						
							
						return apiResponse.successResponseWithData(res,"Department Success.", dept);
							
						
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
 * Update Department.
 * 
 * @param {string}
 *            mobileNoAdmin
 * 
 * @param {string}
 *            token
 * @param {string}
 *            deptId
 * 
 * 
 * 
 * @returns {Object}
 */
exports.departmentUpdate = [

	body("mobileNoAdmin").isLength({ min: 1 }).trim().withMessage("Username must be specified.")
		.isNumeric().withMessage("Username must be a valid Number."),
	
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),
	body("departmentId").isLength({ min: 1 }).trim().withMessage("Department Id must be specified."),
	body("departmentName").isLength({ min: 1 }).trim().withMessage("departmentName must be specified."),
	sanitizeBody("departmentName").escape(),
	sanitizeBody("mobileNoAdmin").escape(),
	sanitizeBody("token").escape(),
	sanitizeBody("departmentId").escape(),
	
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				AdminModel.findOne({$and:[{mobileNo : req.body.mobileNoAdmin},{token : req.body.token}]}).then(admin => {
					if (admin) {
						DepartmentModel.findOne({_id:req.body.departmentId}).then(dept => {
					if (dept) {
						dept.departmentName= decodeURIComponent(req.body.departmentName);
						
						dept.save(function (err) {
							if (err) { return apiResponse.ErrorResponse(res, err); }
							
							return apiResponse.successResponseWithData(res,"Department Updated.", dept);
						});
							
						
							
						
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
 * Update Department status
 * 
 * @param {string}
 *            mobileNoAdmin
 * 
 * @param {string}
 *            token
 * @param {string}
 *            deptId
 * 
 * 
 * 
 * @returns {Object}
 */
exports.departmentUpdateStatus = [

	body("mobileNoAdmin").isLength({ min: 1 }).trim().withMessage("Username must be specified.")
		.isNumeric().withMessage("Username must be a valid Number."),
	
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),
	body("departmentId").isLength({ min: 1 }).trim().withMessage("Department Id must be specified."),
	body("departmentStatus").isLength({ min: 1 }).trim().withMessage("departmentName must be specified."),
	sanitizeBody("departmentStatus").escape(),
	sanitizeBody("mobileNoAdmin").escape(),
	sanitizeBody("token").escape(),
	sanitizeBody("departmentId").escape(),
	
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				AdminModel.findOne({$and:[{mobileNo : req.body.mobileNoAdmin},{token : req.body.token}]}).then(admin => {
					if (admin) {
						DepartmentModel.findOne({_id:req.body.departmentId}).then(dept => {
					if (dept) {
						dept.status= req.body.departmentStatus;
						
						dept.save(function (err) {
							if (err) { return apiResponse.ErrorResponse(res, err); }
							
							return apiResponse.successResponseWithData(res,"Department status Updated.", dept);
						});
							
						
							
						
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
 * Add Sub Departments.
 * 
 * @param {string}
 *            mobileNoAdmin
 * @param {string}
 *            departmentName
 * 
 * @param {string}
 *            token
 * 
 * 
 * 
 * @returns {Object}
 */
exports.insertSubDepartment = [

	body("mobileNoAdmin").isLength({ min: 1 }).trim().withMessage("Username must be specified.")
		.isNumeric().withMessage("Username must be a valid Number."),
	
	
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),
	body("subDepartmentName").isLength({ min: 1 }).trim().withMessage("Sub DepartmentName must be specified."),
	body("departmentId").isLength({ min: 1 }).trim().withMessage("departmentId must be specified."),
	sanitizeBody("subDepartmentName").escape(),
	sanitizeBody("departmentId").escape(),
	sanitizeBody("mobileNoAdmin").escape(),
	sanitizeBody("token").escape(),
	
	
	
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				AdminModel.findOne({$and:[{mobileNo : req.body.mobileNoAdmin},{token : req.body.token}]}).then(admin => {
					if (admin) {
						var subDept = new SubDepartmentModel(
								{
									subDepartmentName: req.body.subDepartmentName,
									departmentId: req.body.departmentId,
									subDepartmentCreatedBy: admin._id
									
								}
							);
						subDept.save(function (err) {
							if (err) { return apiResponse.ErrorResponse(res, err); }
							
							return apiResponse.successResponseWithData(res,"Sub Department Inseted.", subDept);
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
 * Sub Departments.
 * 
 * @param {string}
 *            mobileNoAdmin
 * 
 * @param {string}
 *            token
 * 
 * 
 * 
 * @returns {Object}
 */
exports.subDepartments = [

	body("mobileNoAdmin").isLength({ min: 1 }).trim().withMessage("Username must be specified.")
		.isNumeric().withMessage("Username must be a valid Number."),
	
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),
	body("departmentId").isLength({ min: 1 }).trim().withMessage("DepartmentId must be specified."),

	sanitizeBody("mobileNoAdmin").escape(),
	sanitizeBody("token").escape(),
	sanitizeBody("departmentId").escape(),
	
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				AdminModel.findOne({$and:[{mobileNo : req.body.mobileNoAdmin},{token : req.body.token}]}).then(admin => {
					if (admin) {
						SubDepartmentModel.find({departmentId:req.body.departmentId}).then(subDepts => {
					if (subDepts.length>0) {
						
							
						return apiResponse.successResponseWithData(res,"Departments Success.", subDepts);
							
						
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
 * SubDepartment.
 * 
 * @param {string}
 *            mobileNoAdmin
 * 
 * @param {string}
 *            token
 * @param {string}
 *            subDepartmentId
 * 
 * 
 * 
 * @returns {Object}
 */
exports.subDepartment = [

	body("mobileNoAdmin").isLength({ min: 1 }).trim().withMessage("Username must be specified.")
		.isNumeric().withMessage("Username must be a valid Number."),
	
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),
	body("subDepartmentId").isLength({ min: 1 }).trim().withMessage("Ddepartment Id must be specified."),

	sanitizeBody("mobileNoAdmin").escape(),
	sanitizeBody("token").escape(),
	sanitizeBody("subDepartmentId").escape(),
	
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				AdminModel.findOne({$and:[{mobileNo : req.body.mobileNoAdmin},{token : req.body.token}]}).then(admin => {
					if (admin) {
						SubDepartmentModel.findOne({_id:req.body.subDepartmentId}).then(subdept => {
					if (subdept) {
						
						DepartmentModel.findOne({_id:subdept.departmentId}).then(dept => {
							if (dept) {
						let subDeptDetails={
								_id: subdept._id,
								subDepartmentName:subdept.subDepartmentName,
								subDepartmentCreatedBy:subdept.subDepartmentCreatedBy,
								departmentId:subdept.departmentId,
								departmentName:dept.departmentName,
								status:subdept.status
						};
							
						return apiResponse.successResponseWithData(res,"Sub Department Success.", subDeptDetails);
					}
						});
							
						
					}else{
						
						return apiResponse.successResponse(res,"No Sub Department Details.");
						
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
 * Update SubDepartment.
 * 
 * @param {string}
 *            mobileNoAdmin
 * 
 * @param {string}
 *            token
 * @param {string}
 *            subDepartmentId
 * 
 * 
 * 
 * @returns {Object}
 */
exports.subDepartmentUpdate = [

	body("mobileNoAdmin").isLength({ min: 1 }).trim().withMessage("Username must be specified.")
		.isNumeric().withMessage("Username must be a valid Number."),
	
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),
	body("subDepartmentId").isLength({ min: 1 }).trim().withMessage("Sub Department Id must be specified."),
	body("subDepartmentName").isLength({ min: 1 }).trim().withMessage("Sub DepartmentName must be specified."),
	body("departmentId").isLength({ min: 1 }).trim().withMessage("departmentId must be specified."),
	sanitizeBody("subDepartmentName").escape(),
	sanitizeBody("departmentId").escape(),
	sanitizeBody("mobileNoAdmin").escape(),
	sanitizeBody("token").escape(),
	sanitizeBody("subDepartmentId").escape(),
	
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				AdminModel.findOne({$and:[{mobileNo : req.body.mobileNoAdmin},{token : req.body.token}]}).then(admin => {
					if (admin) {
						SubDepartmentModel.findOne({_id:req.body.subDepartmentId}).then(subdept => {
					if (subdept) {
						subdept.subDepartmentName=req.body.subDepartmentName;
						subdept.departmentId=req.body.departmentId;
						subdept.save(function (err) {
							if (err) { return apiResponse.ErrorResponse(res, err); }
							
							
						});
			
						
						DepartmentModel.findOne({_id:subdept.departmentId}).then(dept => {
							if (dept) {
						let subDeptDetails={
								_id: subdept._id,
								subDepartmentName:subdept.subDepartmentName,
								subDepartmentCreatedBy:subdept.subDepartmentCreatedBy,
								departmentId:subdept.departmentId,
								departmentName:dept.departmentName,
								status:subdept.status
						};
							
						return apiResponse.successResponseWithData(res,"Sub Department Successfully Updated.", subDeptDetails);
					}
						});
							
						
					}else{
						
						return apiResponse.successResponse(res,"No Sub Department Details.");
						
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
 * Add EventProject.
 * 
 * @param {string}
 *            mobileNoAdmin
 * @param {string}
 *            eventProjectName
 * @param {string}
 *            eventProjectPlace
 * @param {string}
 *            eventProjectDate
 * @param {string}
 *            eventProjectDescription
 * @param {string}
 *            eventProjecttype
 * 
 * @param {string}
 *            token
 * 
 * 
 * 
 * @returns {Object}
 */
exports.insertEventProject = [

	body("mobileNoAdmin").isLength({ min: 1 }).trim().withMessage("Username must be specified.")
		.isNumeric().withMessage("Username must be a valid Number."),
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),
	body("eventProjectName").isLength({ min: 1 }).trim().withMessage("Name must be specified."),
	body("eventProjectPlace").isLength({ min: 1 }).trim().withMessage("Place must be specified."),
	body("eventProjectDate").isLength({ min: 1 }).trim().withMessage("Date must be specified."),
	body("eventProjectDescription").isLength({ min: 1 }).trim().withMessage("Description must be specified."),
	body("eventProjectType").isLength({ min: 1 }).trim().withMessage("Type(Event/Project) be specified."),
	sanitizeBody("eventProjectName").escape(),
	sanitizeBody("eventProjectPlace").escape(),
	sanitizeBody("eventProjectDate").escape(),
	sanitizeBody("eventProjectDescription").escape(),
	sanitizeBody("eventProjectType").escape(),
	sanitizeBody("mobileNoAdmin").escape(),
	sanitizeBody("token").escape(),
	
	
	
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				AdminModel.findOne({$and:[{mobileNo : req.body.mobileNoAdmin},{token : req.body.token}]}).then(admin => {
					if (admin) {
						var eventProject = new EventProjectModel(
								{
									eventProjectName: decodeURIComponent(req.body.eventProjectName),
									eventProjectPlace: decodeURIComponent(req.body.eventProjectPlace),
									eventProjectDate: req.body.eventProjectDate,
									eventProjectDescription: decodeURIComponent(req.body.eventProjectDescription),
									eventProjectNameLang: decodeURIComponent(req.body.eventProjectNameLang),
									eventProjectPlaceLang: decodeURIComponent(req.body.eventProjectPlaceLang),
									eventProjectDescriptionLang: decodeURIComponent(req.body.eventProjectDescriptionLang),
									eventProjectType: req.body.eventProjectType,
									eventProjectFileNames: JSON.parse(req.body.eventProjectFileNames),
									eventProjectCreatedBy: admin._id
									
								}
							);
						eventProject.save(function (err) {
							if (err) { return apiResponse.ErrorResponse(res, err); }
							
							return apiResponse.successResponseWithData(res,"Event/Project Inseted.", eventProject);
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
 * EventProjects.
 * 
 * @param {string}
 *            mobileNoAdmin
 * 
 * @param {string}
 *            token
 * @param {string}
 *            eventProjectType
 * 
 * 
 * 
 * @returns {Object}
 */
exports.eventProjects = [

	body("mobileNoAdmin").isLength({ min: 1 }).trim().withMessage("Username must be specified.")
		.isNumeric().withMessage("Username must be a valid Number."),
	
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),
	body("eventProjectType").isLength({ min: 1 }).trim().withMessage("eventProjectType must be specified."),

	sanitizeBody("mobileNoAdmin").escape(),
	sanitizeBody("token").escape(),
	sanitizeBody("eventProjectType").escape(),
	
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				AdminModel.findOne({$and:[{mobileNo : req.body.mobileNoAdmin},{token : req.body.token}]}).then(admin => {
					if (admin) {
						EventProjectModel.find({eventProjectType:req.body.eventProjectType}).sort({eventProjectDate:-1}).then(eventProjects => {
					if (eventProjects.length>0) {
						
							
						return apiResponse.successResponseWithData(res,req.body.eventProjectType+" Success.", eventProjects);
							
						
					}else{
						
						return apiResponse.successResponse(res,"No "+req.body.eventProjectType+" Details.");
						
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
 * EventProjects Status.
 * 
 * @param {string}
 *            mobileNoAdmin
 * 
 * @param {string}
 *            token
 * @param {string}
 *            eventProjectType
 * 
 * 
 * 
 * @returns {Object}
 */
exports.eventProjectsStatus = [

	body("mobileNoAdmin").isLength({ min: 1 }).trim().withMessage("Username must be specified.")
		.isNumeric().withMessage("Username must be a valid Number."),
	
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),
	body("eventProjectType").isLength({ min: 1 }).trim().withMessage("eventProjectType must be specified."),
	body("status").isLength({ min: 1 }).trim().withMessage("status must be specified."),
	sanitizeBody("status").escape(),
	sanitizeBody("mobileNoAdmin").escape(),
	sanitizeBody("token").escape(),
	sanitizeBody("eventProjectType").escape(),
	
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				AdminModel.findOne({$and:[{mobileNo : req.body.mobileNoAdmin},{token : req.body.token}]}).then(admin => {
					if (admin) {
						EventProjectModel.find({$and:[{eventProjectType:req.body.eventProjectType},{status:req.body.status}]}).sort({eventProjectDate:-1}).then(eventProjects => {
					if (eventProjects.length>0) {
						
							
						return apiResponse.successResponseWithData(res,req.body.eventProjectType+" Success.", eventProjects);
							
						
					}else{
						
						return apiResponse.successResponse(res,"No "+req.body.eventProjectType+" Details.");
						
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
* admin stats.
* 
* @param {string}
*            mobileNoAdmin
* 
* @param {string}
*            token
* @param {string}
*            eventProjectType
* 
* 
* 
* @returns {Object}
*/
exports.adminStats = [

	body("mobileNoAdmin").isLength({ min: 1 }).trim().withMessage("Username must be specified.")
		.isNumeric().withMessage("Username must be a valid Number."),

	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),

	sanitizeBody("mobileNoAdmin").escape(),
	sanitizeBody("token").escape(),
	sanitizeBody("eventProjectType").escape(),

	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			} else {
				AdminModel.findOne({ $and: [{ mobileNo: req.body.mobileNoAdmin }, { token: req.body.token }] }).then(admin => {
					if (admin) {

						var eventsAggregate = [
							{ $match: { eventProjectType: 'Event', status: true } },
							{ $group: { _id: "$eventProjectType", count: { $sum: 1 } } }
						];

						var doctorsAggregate = [
							{ $match: { status: 'ACTIVE' } },
							{ $group: { _id: "$status", count: { $sum: 1 } } }
						];

						var hospitalAggregate = [
							{ $match: { status: 'ACTIVE' } },
							{ $group: { _id: "$status", count: { $sum: 1 } } }
						];

						var membershipAggregate = [
							{ $match: { status: 'Active', email: {$exists:true} } },
							{ $group: { _id: "$memberShipStatus", count: { $sum: 1 } } }
						];

						EventProjectModel.aggregate(eventsAggregate, (err, eventResults) => {

							DoctorModel.aggregate(doctorsAggregate, (err, doctorResults) => {

								HospitalModel.aggregate(hospitalAggregate, (err, hospitalResults) => {

									UserModel.aggregate(membershipAggregate, (err, userResult) => {
		
										let stats = {
											events: eventResults,
											doctors: doctorResults,
											hospitals: hospitalResults,
											memberShip: userResult
										}
										return apiResponse.successResponseWithData(res,"stas as follows", stats);
	
									});

								});

							});
						

						});
					}
					else {
						return apiResponse.unauthorizedResponse(res, "Mobile Number or Token wrong.");
					}
				});

			}

		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}];

   

/**
 * EventProjects.
 * 
 * @param {string}
 *            mobileNoAdmin
 * 
 * @param {string}
 *            token
 * @param {string}
 *            eventProjectType
 * 
 * 
 * 
 * @returns {Object}
 */
exports.eventProjectsCounts = [

	body("mobileNoAdmin").isLength({ min: 1 }).trim().withMessage("Username must be specified.")
		.isNumeric().withMessage("Username must be a valid Number."),
	
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),
	body("eventProjectType").isLength({ min: 1 }).trim().withMessage("eventProjectType must be specified."),

	sanitizeBody("mobileNoAdmin").escape(),
	sanitizeBody("token").escape(),
	sanitizeBody("eventProjectType").escape(),
	
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				AdminModel.findOne({$and:[{mobileNo : req.body.mobileNoAdmin},{token : req.body.token}]}).then(admin => {
					if (admin) {
						EventProjectModel.find({eventProjectType:req.body.eventProjectType}).sort({eventProjectDate:-1}).then(eventProjects => {
					if (eventProjects.length>0) {
						
							
						return apiResponse.successResponseWithData(res,req.body.eventProjectType+" Success.", eventProjects.length);
							
						
					}else{
						
						return apiResponse.successResponseWithData(res,"No "+req.body.eventProjectType+" Details.",0);
						
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
 * EventProject.
 * 
 * @param {string}
 *            mobileNoAdmin
 * 
 * @param {string}
 *            token
 * @param {string}
 *            eventProjectId
 * 
 * 
 * 
 * @returns {Object}
 */
exports.eventProject = [

	body("mobileNoAdmin").isLength({ min: 1 }).trim().withMessage("Username must be specified.")
		.isNumeric().withMessage("Username must be a valid Number."),
	
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),
	body("eventProjectId").isLength({ min: 1 }).trim().withMessage("EventProjectId must be specified."),

	sanitizeBody("mobileNoAdmin").escape(),
	sanitizeBody("token").escape(),
	sanitizeBody("eventProjectId").escape(),
	
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				AdminModel.findOne({$and:[{mobileNo : req.body.mobileNoAdmin},{token : req.body.token}]}).then(admin => {
					if (admin) {
						EventProjectModel.findOne({_id:req.body.eventProjectId}).then(eventProject => {
					if (eventProject) {
						
						
						return apiResponse.successResponseWithData(res,eventProject.eventProjectType+" Success.", eventProject);
							
						
					}else{
						
						return apiResponse.successResponse(res,"No  Details.");
						
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
 * Users.
 * 
 * @param {string}
 *            mobileNoAdmin
 * 
 * @param {string}
 *            token
 * 
 * 
 * @returns {Object}
 */
exports.users = [

	body("mobileNoAdmin").isLength({ min: 1 }).trim().withMessage("Username must be specified.")
		.isNumeric().withMessage("Username must be a valid Number."),
	
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),
	

	sanitizeBody("mobileNoAdmin").escape(),
	sanitizeBody("token").escape(),

	
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				AdminModel.findOne({$and:[{mobileNo : req.body.mobileNoAdmin},{token : req.body.token}]}).then(admin => {
					if (admin) {
						UserModel.find().sort({_id:-1}).then(users => {
					if (users.length>0) {
						
							
						return apiResponse.successResponseWithData(res,"Users Success.", users);
							
						
					}else{
						
						return apiResponse.successResponse(res,"No Users Details.");
						
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
 * UsersCount.
 * 
 * @param {string}
 *            mobileNoAdmin
 * 
 * @param {string}
 *            token
 * 
 * 
 * @returns {Object}
 */
exports.usersCounts = [

	body("mobileNoAdmin").isLength({ min: 1 }).trim().withMessage("Username must be specified.")
		.isNumeric().withMessage("Username must be a valid Number."),
	
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),
	

	sanitizeBody("mobileNoAdmin").escape(),
	sanitizeBody("token").escape(),

	
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				AdminModel.findOne({$and:[{mobileNo : req.body.mobileNoAdmin},{token : req.body.token}]}).then(admin => {
					if (admin) {
						UserModel.find().sort({_id:-1}).then(users => {
					if (users.length>0) {
						
							
						return apiResponse.successResponseWithData(res,"Users Success.", users.length);
							
						
					}else{
						
						return apiResponse.successResponseWithData(res,"No Users Details.",0);
						
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
 * Update EventProject.
 * 
 * @param {string}
 *            mobileNoAdmin
 * @param {string}
 *            eventProjectName
 * @param {string}
 *            eventProjectPlace
 * @param {string}
 *            eventProjectDate
 * @param {string}
 *            eventProjectDescription
 * @param {string}
 *            eventProjecttype
 * 
 * @param {string}
 *            token
 * 
 * 
 * 
 * @returns {Object}
 */
exports.updateEventProject = [

	body("mobileNoAdmin").isLength({ min: 1 }).trim().withMessage("Username must be specified.")
		.isNumeric().withMessage("Username must be a valid Number."),
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),
	body("eventProjectName").isLength({ min: 1 }).trim().withMessage("Name must be specified."),
	body("eventProjectId").isLength({ min: 1 }).trim().withMessage("EventProjectId must be specified."),
	body("eventProjectPlace").isLength({ min: 1 }).trim().withMessage("Place must be specified."),
	body("eventProjectDate").isLength({ min: 1 }).trim().withMessage("Date must be specified."),
	body("eventProjectDescription").isLength({ min: 1 }).trim().withMessage("Description must be specified."),
	body("eventProjectType").isLength({ min: 1 }).trim().withMessage("Type(Event/Project) be specified."),
	sanitizeBody("eventProjectName").escape(),
	sanitizeBody("eventProjectId").escape(),
	sanitizeBody("eventProjectPlace").escape(),
	sanitizeBody("eventProjectDate").escape(),
	sanitizeBody("eventProjectDescription").escape(),
	sanitizeBody("eventProjectType").escape(),
	sanitizeBody("mobileNoAdmin").escape(),
	sanitizeBody("token").escape(),
	
	
	
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				AdminModel.findOne({$and:[{mobileNo : req.body.mobileNoAdmin},{token : req.body.token}]}).then(admin => {
					if (admin) {
						EventProjectModel.findOne({_id:req.body.eventProjectId}).then(eventProject => {
							if (eventProject) {
					
								
								eventProject.eventProjectName= decodeURIComponent(req.body.eventProjectName);
								eventProject.eventProjectPlace= decodeURIComponent(req.body.eventProjectPlace);
								eventProject.eventProjectDate= req.body.eventProjectDate;
								eventProject.eventProjectDescription= decodeURIComponent(req.body.eventProjectDescription);
								eventProject.eventProjectType= req.body.eventProjectType;
								eventProject.eventProjectFileNames= JSON.parse(req.body.eventProjectFileNames);
								eventProject.eventProjectNameLang= decodeURIComponent(req.body.eventProjectNameLang);
								eventProject.eventProjectPlaceLang= decodeURIComponent(req.body.eventProjectPlaceLang);
								eventProject.eventProjectDescriptionLang= decodeURIComponent(req.body.eventProjectDescriptionLang);
									
								
						
							
						eventProject.save(function (err) {
							if (err) { return apiResponse.ErrorResponse(res, err); }
							
							return apiResponse.successResponseWithData(res,"Event/Project Updated.", eventProject);
						});
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
 * Update EventProject Status.
 * 
 * @param {string}
 *            mobileNoAdmin
 * @param {string}
 *            eventProjectName
 * @param {string}
 *            eventProjectPlace
 * @param {string}
 *            eventProjectDate
 * @param {string}
 *            eventProjectDescription
 * @param {string}
 *            eventProjecttype
 * 
 * @param {string}
 *            token
 * 
 * 
 * 
 * @returns {Object}
 */
exports.updateEventProjectStatus = [

	body("mobileNoAdmin").isLength({ min: 1 }).trim().withMessage("Username must be specified.")
		.isNumeric().withMessage("Username must be a valid Number."),
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),
	body("status").isLength({ min: 1 }).trim().withMessage("status must be specified."),
	body("eventProjectId").isLength({ min: 1 }).trim().withMessage("EventProjectId must be specified."),

	sanitizeBody("status").escape(),
	sanitizeBody("eventProjectId").escape(),
	
	sanitizeBody("mobileNoAdmin").escape(),
	sanitizeBody("token").escape(),
	
	
	
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				AdminModel.findOne({$and:[{mobileNo : req.body.mobileNoAdmin},{token : req.body.token}]}).then(admin => {
					if (admin) {
						EventProjectModel.findOne({_id:req.body.eventProjectId}).then(eventProject => {
							if (eventProject) {
					
								
								eventProject.status= req.body.status;
							
							
						eventProject.save(function (err) {
							if (err) { return apiResponse.ErrorResponse(res, err); }
							
							return apiResponse.successResponseWithData(res,"Event/Project Status Updated.", eventProject);
						});
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
 * Add ContactNumber.
 * 
 * @param {string}
 *            firstName
 * @param {string}
 *            lastName
 * @param {string}
 *            mobileNo
 * @param {string}
 *            email
 * @param {string}
 *            address
 * @param {string}
 *            eventProjecttype
 * 
 * @param {string}
 *            token
 * 
 * 
 * 
 * @returns {Object}
 */
exports.insertContactNumber = [

	body("lastName").isLength({ min: 1 }).trim().withMessage("Last Name must be specified."),
	body("firstName").isLength({ min: 1 }).trim().withMessage("First Name must be specified."),
	body("mobileNo").isLength({ min: 1 }).trim().withMessage("Name must be specified."),
	body("role").isLength({ min: 1 }).trim().withMessage("Place must be specified."),
	body("email").isLength({ min: 1 }).trim().withMessage("Date must be specified."),
	body("address").isLength({ min: 1 }).trim().withMessage("Description must be specified."),
	//body("profilePhoto").isLength({ min: 1 }).trim().withMessage("Type(Event/Project) be specified."),
	body("mobileNoAdmin").isLength({ min: 1 }).trim().withMessage("Username must be specified.")
	.isNumeric().withMessage("Username must be a valid Number."),
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),
	sanitizeBody("mobileNoAdmin").escape(),
	sanitizeBody("token").escape(),
	sanitizeBody("lastName").escape(),
	sanitizeBody("firstName").escape(),
	sanitizeBody("mobileNo").escape(),
	sanitizeBody("role").escape(),
	sanitizeBody("address").escape(),
	sanitizeBody("profilePhoto").escape(),
	
	
	
	
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				AdminModel.findOne({$and:[{mobileNo : req.body.mobileNoAdmin},{token : req.body.token}]}).then(admin => {
					if (admin) {
						var contactNumber = new ContactNumberModel(
								{
									firstName: decodeURIComponent(req.body.firstName),
									lastName: decodeURIComponent(req.body.lastName),
									mobileNo: req.body.mobileNo,
									role: decodeURIComponent(req.body.role),
									email: req.body.email,
									address: decodeURIComponent(req.body.address),
									headOfService:req.body.headOfService,
									profilePhoto: req.body.profilePhoto,
									
								}
							);
						contactNumber.save(function (err) {
							if (err) { return apiResponse.ErrorResponse(res, err); }
							
							return apiResponse.successResponseWithData(res,"ContactNumber Inseted.", contactNumber);
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
 * contactNumbersHeadOfService.
 * 
 * @param {string}
 *            mobileNoAdmin
 * 
 * @param {string}
 *            token
 * 
 * 
 * 
 * @returns {Object}
 */
exports.contactNumbersHeadOfService = [

	body("mobileNoAdmin").isLength({ min: 1 }).trim().withMessage("Username must be specified.")
		.isNumeric().withMessage("Username must be a valid Number."),
	
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),

	sanitizeBody("mobileNoAdmin").escape(),
	sanitizeBody("token").escape(),

	
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				AdminModel.findOne({$and:[{mobileNo : req.body.mobileNoAdmin},{token : req.body.token}]}).then(admin => {
					if (admin) {
						ContactNumberModel.find({headOfService:"headOfService"}).sort({_id:-1}).then(contactNumbers => {
					if (contactNumbers.length>0) {
						
							
						return apiResponse.successResponseWithData(res,"Contact Numbers Success.", contactNumbers);
							
						
					}else{
						
						return apiResponse.successResponse(res,"No Contact Numbers Details.");
						
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
 * ContactNumber.
 * 
 * @param {string}
 *            mobileNoAdmin
 * 
 * @param {string}
 *            token
 * @param {string}
 *            eventProjectType
 * 
 * 
 * 
 * @returns {Object}
 */
exports.contactNumbers = [

	body("mobileNoAdmin").isLength({ min: 1 }).trim().withMessage("Username must be specified.")
		.isNumeric().withMessage("Username must be a valid Number."),
	
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),

	sanitizeBody("mobileNoAdmin").escape(),
	sanitizeBody("token").escape(),

	
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				AdminModel.findOne({$and:[{mobileNo : req.body.mobileNoAdmin},{token : req.body.token}]}).then(admin => {
					if (admin) {
						ContactNumberModel.find({headOfService:""}).then(contactNumbers => {
					if (contactNumbers.length>0) {
						
							
						return apiResponse.successResponseWithData(res,"Contact Numbers Success.", contactNumbers);
							
						
					}else{
						
						return apiResponse.successResponse(res,"No Contact Numbers Details.");
						
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
 * ContactNumber.
 * 
 * @param {string}
 *            mobileNoAdmin
 * 
 * @param {string}
 *            token
 * @param {string}
 *            eventProjectType
 * 
 * 
 * 
 * @returns {Object}
 */
exports.contactNumber = [

	body("mobileNoAdmin").isLength({ min: 1 }).trim().withMessage("Username must be specified.")
		.isNumeric().withMessage("Username must be a valid Number."),
	
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),
	body("contactNumberId").isLength({ min: 1 }).trim().withMessage("Contact Number must be specified."),
	sanitizeBody("contactNumberId").escape(),
	sanitizeBody("mobileNoAdmin").escape(),
	sanitizeBody("token").escape(),

	
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				AdminModel.findOne({$and:[{mobileNo : req.body.mobileNoAdmin},{token : req.body.token}]}).then(admin => {
					if (admin) {
						ContactNumberModel.findOne({_id:req.body.contactNumberId}).then(contactNumber => {
					if (contactNumber) {
						
							
						return apiResponse.successResponseWithData(res,"Contact Number Success.", contactNumber);
							
						
					}else{
						
						return apiResponse.successResponse(res,"No Contact Number Details.");
						
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
 * ContactNumber.
 * 
 * @param {string}
 *            mobileNoAdmin
 * 
 * @param {string}
 *            token
 * @param {string}
 *            eventProjectType
 * 
 * 
 * 
 * @returns {Object}
 */
exports.contactNumberRemove = [

	body("mobileNoAdmin").isLength({ min: 1 }).trim().withMessage("Username must be specified.")
		.isNumeric().withMessage("Username must be a valid Number."),
	
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),
	body("contactNumberId").isLength({ min: 1 }).trim().withMessage("Contact Number must be specified."),
	sanitizeBody("contactNumberId").escape(),
	sanitizeBody("mobileNoAdmin").escape(),
	sanitizeBody("token").escape(),

	
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				AdminModel.findOne({$and:[{mobileNo : req.body.mobileNoAdmin},{token : req.body.token}]}).then(admin => {
					if (admin) {
						ContactNumberModel.findOne({_id:req.body.contactNumberId}).then(contactNumber => {
					if (contactNumber) {
						
						contactNumber.remove();	
						return apiResponse.successResponseWithData(res,"Contact Number Removed Success.", contactNumber);
							
						
					}else{
						
						return apiResponse.successResponse(res,"No Contact Number Details.");
						
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
 * Update ContactNumber.
 * 
 * @param {string}
 *            firstName
 * @param {string}
 *            lastName
 * @param {string}
 *            mobileNo
 * @param {string}
 *            email
 * @param {string}
 *            address
 * @param {string}
 *            eventProjecttype
 * 
 * @param {string}
 *            token
 * 
 * 
 * 
 * @returns {Object}
 */
exports.updateContactNumber = [

	body("contactNumberId").isLength({ min: 1 }).trim().withMessage("Contact Number Id must be specified."),
	body("lastName").isLength({ min: 1 }).trim().withMessage("Last Name must be specified."),
	body("firstName").isLength({ min: 1 }).trim().withMessage("First Name must be specified."),
	body("mobileNo").isLength({ min: 1 }).trim().withMessage("Name must be specified."),
	body("role").isLength({ min: 1 }).trim().withMessage("Place must be specified."),
	body("email").isLength({ min: 1 }).trim().withMessage("Date must be specified."),
	body("address").isLength({ min: 1 }).trim().withMessage("Description must be specified."),
	//body("profilePhoto").isLength({ min: 1 }).trim().withMessage("Type(Event/Project) be specified."),
	body("mobileNoAdmin").isLength({ min: 1 }).trim().withMessage("Username must be specified.")
	.isNumeric().withMessage("Username must be a valid Number."),
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),
	sanitizeBody("mobileNoAdmin").escape(),
	sanitizeBody("contactNumberId").escape(),
	sanitizeBody("token").escape(),
	sanitizeBody("lastName").escape(),
	sanitizeBody("firstName").escape(),
	sanitizeBody("mobileNo").escape(),
	sanitizeBody("role").escape(),
	sanitizeBody("address").escape(),
	sanitizeBody("profilePhoto").escape(),
	
	
	
	
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				AdminModel.findOne({$and:[{mobileNo : req.body.mobileNoAdmin},{token : req.body.token}]}).then(admin => {
					if (admin) {
						ContactNumberModel.findOne({_id:req.body.contactNumberId}).then(contactNumber => {
							if (contactNumber) {
						
								contactNumber.firstName= decodeURIComponent(req.body.firstName);
								contactNumber.lastName= decodeURIComponent(req.body.lastName);
								contactNumber.mobileNo= req.body.mobileNo;
								contactNumber.role= decodeURIComponent(req.body.role);
								contactNumber.email= req.body.email;
								contactNumber.headOfService= req.body.headOfService;
								contactNumber.address= decodeURIComponent(req.body.address);
								contactNumber.profilePhoto= req.body.profilePhoto;
								
							contactNumber.save(function (err) {
								if (err) { return apiResponse.ErrorResponse(res, err); }
								
								return apiResponse.successResponseWithData(res,"Contact Number Updated.", contactNumber);
							});
						}
						else
						{
							return apiResponse.successResponse(res,"No Contact Number.");
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
 * Contact Us
 * 
 * @param {string}
 *            mobileNoAdmin
 * 
 * @param {string}
 *            token
 * 
 * 
 * 
 * @returns {Object}
 */
exports.contactUs = [

	body("mobileNoAdmin").isLength({ min: 1 }).trim().withMessage("Username must be specified.")
		.isNumeric().withMessage("Username must be a valid Number."),
	
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),

	sanitizeBody("mobileNoAdmin").escape(),
	sanitizeBody("token").escape(),
	
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				AdminModel.findOne({$and:[{mobileNo : req.body.mobileNoAdmin},{token : req.body.token}]}).then(admin => {
					if (admin) {
				ContactUsModel.find().then(contactUs => {
					if (contactUs.length>0) {
						
							
						return apiResponse.successResponseWithData(res,"ContactUs Details Success.", contactUs[0]);
							
						
					}else{
						
						return apiResponse.successResponse(res,"No ContactUs Details.");
						
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
 * Contact Us Update Profile.
 * 
 * @param {string}
 *            mobileNo
 * 
 * 
 * 
 * @returns {Object}
 */
exports.updateContactUs = [
	body("mobileNo").isLength({ min: 1 }).trim().withMessage("Contact Number must be specified."),
		//.isNumeric().withMessage("Contact No must be a valid Number."),
	body("mobileNoAdmin").isLength({ min: 1 }).trim().withMessage("Username must be specified.")
		.isNumeric().withMessage("Username must be a valid Number."),
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),
	sanitizeBody("mobileNo").escape(),
	sanitizeBody("mobileNoAdmin").escape(),
	sanitizeBody("token").escape(),
	
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				AdminModel.findOne({$and:[{mobileNo : req.body.mobileNoAdmin},{token : req.body.token}]}).then(admin => {
					if (admin) {
				ContactUsModel.find().then(contactUs => {
					if (contactUs.length>0) {
						
						contact=contactUs[0];
								
									if(contact.status) {
										
										contact.mobileNo=req.body.mobileNo;
										
										contact.save(function (err) {
											if (err) { return apiResponse.ErrorResponse(res, err); }
											return apiResponse.successResponseWithData(res,"Updated Success.", contact);
										});
										
									}else {
										return apiResponse.unauthorizedResponse(res, "Contact Us Not active. Please contact admin.");
									}
								
							
						
					}else{
						
						var contactUs = new ContactUsModel(
								{
									
									mobileNo:req.body.mobileNo
								}
							);
						
						contactUs.save(function (err) {
							if (err) { return apiResponse.ErrorResponse(res, err); }
							return apiResponse.successResponseWithData(res,"Updated Success.", contactUs);
						});
						
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
 * Add Social Media Linking.
 * 
 * @param {string}
 *            mobileNoAdmin
 * @param {string}
 *            socialMediaType
 * @param {string}
 *            socialMediaTypeUrl
 * 
 * @param {string}
 *            token
 * 
 * 
 * 
 * @returns {Object}
 */
exports.insertSocialMediaLinking = [

	body("mobileNoAdmin").isLength({ min: 1 }).trim().withMessage("Username must be specified.")
		.isNumeric().withMessage("Username must be a valid Number."),
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),
	body("socialMediaType").isLength({ min: 1 }).trim().withMessage("Department Name must be specified."),
	body("socialMediaTypeUrl").isLength({ min: 1 }).trim().withMessage("Social MediaType Url must be specified."),
	sanitizeBody("socialMediaType").escape(),
	sanitizeBody("socialMediaTypeUrl").escape(),
	sanitizeBody("mobileNoAdmin").escape(),
	sanitizeBody("token").escape(),
	
	
	
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				AdminModel.findOne({$and:[{mobileNo : req.body.mobileNoAdmin},{token : req.body.token}]}).then(admin => {
					if (admin) {
						var socialMediaLinking = new SocialMediaLinkingModel(
								{
									socialMediaType: req.body.socialMediaType,
									socialMediaTypeUrl: decodeURIComponent(req.body.socialMediaTypeUrl),
									socialMediaTypeCreatedBy: admin._id
									
								}
							);
						socialMediaLinking.save(function (err) {
							if (err) { return apiResponse.ErrorResponse(res, err); }
							
							return apiResponse.successResponseWithData(res,"Social Media Linking Inseted.", socialMediaLinking);
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
 * Social media Linkings.
 * 
 * @param {string}
 *            mobileNoAdmin
 * 
 * @param {string}
 *            token
 * @param {string}
 *            eventProjectType
 * 
 * 
 * 
 * @returns {Object}
 */
exports.socialMediaLinkings = [

	body("mobileNoAdmin").isLength({ min: 1 }).trim().withMessage("Username must be specified.")
		.isNumeric().withMessage("Username must be a valid Number."),
	
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),

	sanitizeBody("mobileNoAdmin").escape(),
	sanitizeBody("token").escape(),

	
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				AdminModel.findOne({$and:[{mobileNo : req.body.mobileNoAdmin},{token : req.body.token}]}).then(admin => {
					if (admin) {
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
 * Social media Linkings.
 * 
 * @param {string}
 *            mobileNoAdmin
 * 
 * @param {string}
 *            token
 * @param {string}
 *            eventProjectType
 * 
 * 
 * 
 * @returns {Object}
 */
exports.socialMediaLinking = [

	body("mobileNoAdmin").isLength({ min: 1 }).trim().withMessage("Username must be specified.")
		.isNumeric().withMessage("Username must be a valid Number."),
	
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),
	body("socialMediaLinkingId").isLength({ min: 1 }).trim().withMessage("SocialMediaLinkingId must be specified."),

	sanitizeBody("mobileNoAdmin").escape(),
	sanitizeBody("token").escape(),
	sanitizeBody("socialMediaLinkingId").escape(),

	
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				AdminModel.findOne({$and:[{mobileNo : req.body.mobileNoAdmin},{token : req.body.token}]}).then(admin => {
					if (admin) {
						SocialMediaLinkingModel.findOne({_id:req.body.socialMediaLinkingId}).then(socialMediaLinking => {
					if (socialMediaLinking) {
						
							
						return apiResponse.successResponseWithData(res,"SocialMedia Linking Success.", socialMediaLinking);
							
						
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
 * Social media Linking Update.
 * 
 * @param {string}
 *            mobileNoAdmin
 * 
 * @param {string}
 *            token
 * @param {string}
 *            eventProjectType
 * 
 * 
 * 
 * @returns {Object}
 */
exports.socialMediaLinkingUpdate = [

	body("mobileNoAdmin").isLength({ min: 1 }).trim().withMessage("Username must be specified.")
		.isNumeric().withMessage("Username must be a valid Number."),
	
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),
	body("socialMediaLinkingId").isLength({ min: 1 }).trim().withMessage("SocialMediaLinkingId must be specified."),
	body("socialMediaType").isLength({ min: 1 }).trim().withMessage("Department Name must be specified."),
	body("socialMediaTypeUrl").isLength({ min: 1 }).trim().withMessage("Social MediaType Url must be specified."),
	sanitizeBody("socialMediaType").escape(),
	sanitizeBody("socialMediaTypeUrl").escape(),
	sanitizeBody("mobileNoAdmin").escape(),
	sanitizeBody("token").escape(),
	sanitizeBody("socialMediaLinkingId").escape(),

	
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				AdminModel.findOne({$and:[{mobileNo : req.body.mobileNoAdmin},{token : req.body.token}]}).then(admin => {
					if (admin) {
						SocialMediaLinkingModel.findOne({_id:req.body.socialMediaLinkingId}).then(socialMediaLinking => {
					if (socialMediaLinking) {
						
						socialMediaLinking.socialMediaType= req.body.socialMediaType;
						socialMediaLinking.socialMediaTypeUrl= decodeURIComponent(req.body.socialMediaTypeUrl);
							
						socialMediaLinking.save(function (err) {
							if (err) { return apiResponse.ErrorResponse(res, err); }
							
							return apiResponse.successResponseWithData(res,"Social Media Linking Updated.", socialMediaLinking);
						});
						
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
 * Complaints.
 * 
 * @param {string}
 *            complaintStatus
 * @param {string}
 *            mobileNoAdmin
 * @param {string}
 *            token
 * 
 * 
 * @returns {Object}
 */
exports.complaints = [
	body("mobileNoAdmin").isLength({ min: 1 }).trim().withMessage("Mobile Number must be specified.")
		.isNumeric().withMessage("Mobile No must be a valid Number."),
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),
	body("complaintStatus").isLength({ min: 1 }).trim().withMessage("Complaint Status must be specified."),
	sanitizeBody("complaintStatus").escape(),
	sanitizeBody("mobileNoAdmin").escape(),
	sanitizeBody("token").escape(),
	

	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				AdminModel.findOne({$and:[{mobileNo : req.body.mobileNoAdmin},{token : req.body.token}]}).then(admin => {
					if (admin) {
						
							
								
									if(admin.status) {
									
										if(req.body.complaintStatus=="All")
										{
											ComplaintModel.find().sort({_id:-1}).then(complaints => {
												if (complaints.length>0) {
													
													UserModel.find({},{fullName:1,voterId:1}).sort({_id:-1}).then(users => {
														if (users.length>0) {
															
															var cms = new Array();	
															for (ind = 0; ind < complaints.length; ind++) {
																var complaint=complaints[ind];
																
																let userDetails=null;
																for(i=0;i<users.length;i++)
																{
																	var usr=users[i];
																	if(usr._id==complaint.complaintCreatedBy)
																	{
																		userDetails=usr;
																		break;
																	}
																}	let complaintDetails={
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
																			user:userDetails,
																			complaintStatus:complaint.complaintStatus,
																			createdAt:complaint.createdAt,
																			
																			
																	};
																	
																	cms[ind]=complaintDetails;		
																	
																
																}
															return apiResponse.successResponseWithData(res,"Complaints Success.", cms);
																
															
														}else{
															
															return apiResponse.successResponse(res,"No Complaint Details.");
															
														}
													});
														
													
														
													
												}else{
													
													return apiResponse.successResponse(res,"No Complaint Details.");
													
												}
											});
										}
										else
										{
											ComplaintModel.find({complaintStatus:req.body.complaintStatus}).sort({_id:-1}).then(complaints => {
												if (complaints.length>0) {
													
														
													UserModel.find({},{fullName:1,voterId:1}).sort({_id:-1}).then(users => {
														if (users.length>0) {
															
															var cms = new Array();	
															for (ind = 0; ind < complaints.length; ind++) {
																var complaint=complaints[ind];
																
																let userDetails=null;
																for(i=0;i<users.length;i++)
																{
																	var usr=users[i];
																	if(usr._id==complaint.complaintCreatedBy)
																	{
																		userDetails=usr;
																		break;
																	}
																}	let complaintDetails={
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
																			user:userDetails,
																			complaintStatus:complaint.complaintStatus,
																			createdAt:complaint.createdAt,
																			
																			
																	};
																	
																	cms[ind]=complaintDetails;		
																	
																
																}
															return apiResponse.successResponseWithData(res,"Complaints Success.", cms);
																
															
														}else{
															
															return apiResponse.successResponse(res,"No Complaint Details.");
															
														}
													});
														
													
												}else{
													
													return apiResponse.successResponse(res,"No Complaint Details.");
													
												}
											});
										}
										
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
 * Complaints.
 * 
 * @param {string}
 *            complaintStatus
 * @param {string}
 *            mobileNoAdmin
 * @param {string}
 *            token
 * 
 * 
 * @returns {Object}
 */
exports.complaintsCounts = [
	body("mobileNoAdmin").isLength({ min: 1 }).trim().withMessage("Mobile Number must be specified.")
		.isNumeric().withMessage("Mobile No must be a valid Number."),
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),
	body("complaintStatus").isLength({ min: 1 }).trim().withMessage("Complaint Status must be specified."),
	sanitizeBody("complaintStatus").escape(),
	sanitizeBody("mobileNoAdmin").escape(),
	sanitizeBody("token").escape(),
	

	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				AdminModel.findOne({$and:[{mobileNo : req.body.mobileNoAdmin},{token : req.body.token}]}).then(admin => {
					if (admin) {
						
							
								
									if(admin.status) {
									
										if(req.body.complaintStatus=="All")
										{
											ComplaintModel.find().sort({_id:-1}).then(complaints => {
												if (complaints.length>0) {
													
														
													return apiResponse.successResponseWithData(res,"Complaints Success.", complaints.length);
														
													
												}else{
													
													return apiResponse.successResponseWithData(res,"No Complaint Details.",0);
													
												}
											});
										}
										else
										{
											ComplaintModel.find({complaintStatus:req.body.complaintStatus}).sort({_id:-1}).then(complaints => {
												if (complaints.length>0) {
													
														
													return apiResponse.successResponseWithData(res,"Complaints Success.", complaints.length);
														
													
												}else{
													
													return apiResponse.successResponseWithData(res,"No Complaint Details.",0);
													
												}
											});
										}
										
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
 * EventProjectsFilter.
 * 
 * @param {string}
 *            mobileNoAdmin
 * 
 * @param {string}
 *            token
 * @param {string}
 *            eventProjectType
 * 
 * 
 * 
 * @returns {Object}
 */
exports.eventProjectsFilter = [

	body("mobileNoAdmin").isLength({ min: 1 }).trim().withMessage("Username must be specified.")
		.isNumeric().withMessage("Username must be a valid Number."),
	
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),
	body("eventProjectType").isLength({ min: 1 }).trim().withMessage("eventProjectType must be specified."),

	sanitizeBody("mobileNoAdmin").escape(),
	sanitizeBody("token").escape(),
	sanitizeBody("eventProjectType").escape(),
	
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				AdminModel.findOne({$and:[{mobileNo : req.body.mobileNoAdmin},{token : req.body.token}]}).then(admin => {
					if (admin) {
						let dateFrom=req.body.dateFrom.trim();
						let dateTo=req.body.dateTo.trim();
						if(dateFrom.length>0&&dateTo.length>0)
						{
							let startTime = new Date(dateFrom).getTime();  
							let endTime = new Date(dateTo).getTime();  
							
						EventProjectModel.find({"eventProjectDate":{$gte: startTime,
						    $lte: endTime},eventProjectType:req.body.eventProjectType}).sort({eventProjectDate:-1}).then(eventProjects => {
					if (eventProjects.length>0) {
						
							
						return apiResponse.successResponseWithData(res,req.body.eventProjectType+" Success.", eventProjects);
							
						
					}else{
						
						return apiResponse.successResponse(res,"No "+req.body.eventProjectType+" Details.");
						
					}
					
				});
					}
						else 	if(dateFrom.length>0)
						{
							let startTime = new Date(dateFrom).getTime();  
							  
							
						EventProjectModel.find({"eventProjectDate":{$gte: startTime},eventProjectType:req.body.eventProjectType}).sort({eventProjectDate:-1}).then(eventProjects => {
					if (eventProjects.length>0) {
						
							
						return apiResponse.successResponseWithData(res,req.body.eventProjectType+" Success.", eventProjects);
							
						
					}else{
						
						return apiResponse.successResponse(res,"No "+req.body.eventProjectType+" Details.");
						
					}
					
				});
					}
						else 	if(dateTo.length>0)
						{
							 
							let endTime = new Date(dateTo).getTime();  
							
						EventProjectModel.find({"eventProjectDate":{$lte: endTime},eventProjectType:req.body.eventProjectType}).sort({eventProjectDate:-1}).then(eventProjects => {
					if (eventProjects.length>0) {
						
							
						return apiResponse.successResponseWithData(res,req.body.eventProjectType+" Success.", eventProjects);
							
						
					}else{
						
						return apiResponse.successResponse(res,"No "+req.body.eventProjectType+" Details.");
						
					}
					
				});
					}
						else{
							
							return apiResponse.successResponse(res,"No "+req.body.eventProjectType+" Details.");
							
						}
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

exports.findUser = function findUser(userId){

    const foundUser = UserModel.findOne({_id: userId}, function(err, userObj){
        if(err){
            return err
        }       else if (userObj){
            return userObj
        }       else{
            return null
        }
    })

    return foundUser
};

/**
 * complaintsFilter.
 * 
 * @param {string}
 *            complaintStatus
 * @param {string}
 *            mobileNoAdmin
 * @param {string}
 *            token
 * 
 * 
 * @returns {Object}
 */
exports.complaintsFilter = [
	body("mobileNoAdmin").isLength({ min: 1 }).trim().withMessage("Mobile Number must be specified.")
		.isNumeric().withMessage("Mobile No must be a valid Number."),
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),
	body("complaintStatus").isLength({ min: 1 }).trim().withMessage("Complaint Status must be specified."),
	sanitizeBody("complaintStatus").escape(),
	sanitizeBody("mobileNoAdmin").escape(),
	sanitizeBody("token").escape(),
	

	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				AdminModel.findOne({$and:[{mobileNo : req.body.mobileNoAdmin},{token : req.body.token}]}).then(admin => {
					if (admin) {
						
							
								
									if(admin.status) {
								
										UserModel.find({},{fullName:1,voterId:1}).sort({_id:-1}).then(users => {
											if (users.length>0) {
												
													
												let complaintStatus=req.body.complaintStatus.trim();
												let published=req.body.published.trim();
												let dateFrom=req.body.dateFrom.trim();
												let dateTo=req.body.dateTo.trim();
												let complaintDepartmentName=req.body.complaintDepartmentName ? req.body.complaintDepartmentName.trim() : '';
												
												let filters = {};
												if(dateFrom.length>0 && dateTo.length > 0){
													let startTime = new Date(dateFrom).getTime();  
													let endTime = new Date(dateTo).getTime();
													filters["createdAt"] = { $gte: startTime, $lte: endTime}
												} else if(dateFrom.length>0){
													let startTime = new Date(dateFrom).getTime();  
													filters["createdAt"] = { $gte: startTime}
												} else if(dateTo.length>0){
													let endTime = new Date(dateTo).getTime();
													ilters["createdAt"] = { $lte: endTime}
												}

												if(complaintStatus != "All"){
													filters["complaintStatus"] = complaintStatus;
												}

												if(published != "All"){
													filters["complaintPublish"] = published;
												}

												if(complaintDepartmentName.length>0 && complaintDepartmentName != "All"){
													filters["complaintDepartmentName"] = complaintDepartmentName;
												}
												filters["status"] = true;
												

												ComplaintModel.find({
													
													...filters,

												}).then(complaints => {
													var cms = new Array();
													
													if (complaints.length>0) {
														
														for (ind = 0; ind < complaints.length; ind++) {
															var complaint=complaints[ind];
															
															
																let userDetails=null;
																for(i=0;i<users.length;i++)
																{
																	var usr=users[i];
																	if(usr._id==complaint.complaintCreatedBy)
																	{
																		userDetails=usr;
																		break;
																	}
																}
															
															  
															
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
																		user:userDetails,
																		complaintStatus:complaint.complaintStatus,
																		createdAt:complaint.createdAt,
																		
																		
																};
																
																cms[ind]=complaintDetails;		
																
															
															}
														
															
														return apiResponse.successResponseWithData(res,"Complaints Success.", cms);
															
														
													}else{
														
														return apiResponse.successResponse(res,"No Complaint Details.");
														
													}
												});
													
												
											}else{
												
												return apiResponse.successResponse(res,"No Complaints Details.");
												
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
 * Complaint.
 * 
 * @param {string}
 *            complaintStatus
 * @param {string}
 *            mobileNoAdmin
 * @param {string}
 *            token
 * 
 * 
 * @returns {Object}
 */
exports.complaint = [
	body("mobileNoAdmin").isLength({ min: 1 }).trim().withMessage("Mobile Number must be specified.")
		.isNumeric().withMessage("Mobile No must be a valid Number."),
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),
	body("complaintId").isLength({ min: 1 }).trim().withMessage("Complaint Status must be specified."),
	sanitizeBody("complaintId").escape(),
	sanitizeBody("mobileNoAdmin").escape(),
	sanitizeBody("token").escape(),
	

	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				AdminModel.findOne({$and:[{mobileNo : req.body.mobileNoAdmin},{token : req.body.token}]}).then(admin => {
					if (admin) {
						
							
								
									if(admin.status) {
									
										ComplaintModel.findOne({_id:req.body.complaintId}).then(complaint=> {
											if (complaint) {
												UserModel.findOne({_id:complaint.complaintCreatedBy}).then(user => {
													if (user) {
														
										
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
																				user:user,
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
																				user:user,
																				logs:[],
																				complaintStatus:complaint.complaintStatus,
																				createdAt:complaint.createdAt,
																				
																				
																		};
																		return apiResponse.successResponseWithData(res,"Complaint Success.", complaintDetails);
																	}
																});
														
														
															
														
													}
														});
												
												
													
												
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
 * complaintNumber.
 * 
 * @param {string}
 *            complaintStatus
 * @param {string}
 *            mobileNoAdmin
 * @param {string}
 *            token
 * 
 * 
 * @returns {Object}
 */
exports.complaintNumber = [
	body("mobileNoAdmin").isLength({ min: 1 }).trim().withMessage("Mobile Number must be specified.")
		.isNumeric().withMessage("Mobile No must be a valid Number."),
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),
	body("complaintNumber").isLength({ min: 1 }).trim().withMessage("Complaint Number must be specified."),
	sanitizeBody("complaintNumber").escape(),
	sanitizeBody("mobileNoAdmin").escape(),
	sanitizeBody("token").escape(),
	

	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				AdminModel.findOne({$and:[{mobileNo : req.body.mobileNoAdmin},{token : req.body.token}]}).then(admin => {
					if (admin) {
						
							
								
									if(admin.status) {
									
										ComplaintModel.findOne({complaintNumber:req.body.complaintNumber}).then(complaint=> {
											if (complaint) {
												UserModel.findOne({_id:complaint.complaintCreatedBy}).then(user => {
													if (user) {
														
														
												
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
																user:user,
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
																user:user,
																logs:[],
																complaintStatus:complaint.complaintStatus,
																createdAt:complaint.createdAt,
																
																
														};
														return apiResponse.successResponseWithData(res,"Complaint Success.", complaintDetails);
													}
												});
												
												
													
												
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
 * Complaint Update.
 * 
 * 
 * @param {string}
 *            mobileNo
 * @param {string}
 *            token
 * 
 * 
 * @returns {Object}
 */
exports.complaintUpdate = [
	body("mobileNoAdmin").isLength({ min: 1 }).trim().withMessage("Mobile Number must be specified.")
		.isNumeric().withMessage("Mobile No must be a valid Number."),
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),
	body("complaintId").isLength({ min: 1 }).trim().withMessage("Complaint Id must be specified."),
	body("complaintReplyDescription").isLength({ min: 1 }).trim().withMessage("complaintReplyDescription must be specified."),
	body("complaintStatus").isLength({ min: 1 }).trim().withMessage("Status must be specified."),
	sanitizeBody("complaintReplyDescription").escape(),
	sanitizeBody("complaintStatus").escape(),
	sanitizeBody("mobileNoAdmin").escape(),
	sanitizeBody("token").escape(),
	sanitizeBody("complaintId").escape(),
	

	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				AdminModel.findOne({$and:[{mobileNo : req.body.mobileNoAdmin},{token : req.body.token}]}).then(admin => {
					if (admin) {
						
							
								
									if(admin.status) {
									
										ComplaintModel.findOne({_id:req.body.complaintId}).then(complaint => {
											if (complaint) {
												
													
											
												complaint.complaintReplyBy= admin._id;
												complaint.complaintReplyDescription= req.body.complaintDescription;
												
												complaint.complaintStatus=req.body.complaintStatus;
													
												complaint.save(function (err) {
													if (err) { return apiResponse.ErrorResponse(res, err); }
													var complaintLog = new ComplaintLogModel(
															{
																complaintId: req.body.complaintId,
																complaintStatus:req.body.complaintStatus,
																complaintLogCreatedBy: admin._id
																
															}
														);
													complaintLog.save(function (err) {
														if (err) { return apiResponse.ErrorResponse(res, err); }
														
														
													});
													
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
 * Complaint Publish Update.
 * 
 * 
 * @param {string}
 *            mobileNo
 * @param {string}
 *            token
 * 
 * 
 * @returns {Object}
 */
exports.complaintUpdatePublish = [
	body("mobileNoAdmin").isLength({ min: 1 }).trim().withMessage("Mobile Number must be specified.")
		.isNumeric().withMessage("Mobile No must be a valid Number."),
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),
	body("complaintId").isLength({ min: 1 }).trim().withMessage("Complaint Id must be specified."),
	// body("complaintPublish").isLength({ min: 1
	// }).trim().withMessage("complaintReplyDescription must be specified."),
	// sanitizeBody("complaintPublish").escape(),
	
	sanitizeBody("mobileNoAdmin").escape(),
	sanitizeBody("token").escape(),
	// sanitizeBody("complaintId").escape(),
	

	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				AdminModel.findOne({$and:[{mobileNo : req.body.mobileNoAdmin},{token : req.body.token}]}).then(admin => {
					if (admin) {
						
							
								
									if(admin.status) {
									
										ComplaintModel.findOne({_id:req.body.complaintId}).then(complaint => {
											if (complaint) {
												
													
											
												complaint.complaintReplyBy= admin._id;
												complaint.complaintPublish= req.body.complaintPublish;
												
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
 * Add Album.
 * 
 * @param {string}
 *            mobileNoAdmin
 * @param {string}
 *            albumTitle
 * @param {string}
 *            albumFiles
 * @param {string}
 *            token
 * 
 * 
 * 
 * @returns {Object}
 */
exports.insertAlbum = [

	body("mobileNoAdmin").isLength({ min: 1 }).trim().withMessage("Username must be specified.")
		.isNumeric().withMessage("Username must be a valid Number."),
	
	
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),
	body("albumTitle").isLength({ min: 1 }).trim().withMessage("albumTitle must be specified."),
	body("albumFiles").isLength({ min: 1 }).trim().withMessage("albumFiles must be specified."),
	sanitizeBody("albumTitle").escape(),
	//sanitizeBody("albumFiles").escape(),
	sanitizeBody("mobileNoAdmin").escape(),
	sanitizeBody("token").escape(),
	
	
	
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				AdminModel.findOne({$and:[{mobileNo : req.body.mobileNoAdmin},{token : req.body.token}]}).then(admin => {
					if (admin) {
						var album = new AlbumModel(
								{
									albumTitle: decodeURIComponent(req.body.albumTitle),
									albumFiles: JSON.parse(req.body.albumFiles),
									albumCreatedBy: admin._id
									
								}
							);
						album.save(function (err) {
							if (err) { return apiResponse.ErrorResponse(res, err); }
							
							return apiResponse.successResponseWithData(res,"Album Inseted.", album);
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
 * Album.
 * 
 * @param {string}
 *            mobileNoAdmin
 * 
 * @param {string}
 *            token
 * 
 * 
 * @returns {Object}
 */
exports.albums = [

	body("mobileNoAdmin").isLength({ min: 1 }).trim().withMessage("Username must be specified.")
		.isNumeric().withMessage("Username must be a valid Number."),
	
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),
	
	sanitizeBody("mobileNoAdmin").escape(),
	sanitizeBody("token").escape(),
	
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				AdminModel.findOne({$and:[{mobileNo : req.body.mobileNoAdmin},{token : req.body.token}]}).then(admin => {
					if (admin) {
						AlbumModel.find({albumstatus:true}).sort({_id:-1}).then(albums => {
							if (albums.length>0) {
								
									
								return apiResponse.successResponseWithData(res,"Albums Success.", albums);
							
						
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
 * Album.
 * 
 * @param {string}
 *            mobileNoAdmin
 * 
 * @param {string}
 *            token
 * 
 * 
 * @returns {Object}
 */
exports.albums_status = [

	body("mobileNoAdmin").isLength({ min: 1 }).trim().withMessage("Username must be specified.")
		.isNumeric().withMessage("Username must be a valid Number."),
	
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),
	body("albumstatus").isLength({ min: 1 }).trim().withMessage("Token must be specified."),
	
	sanitizeBody("albumstatus").escape(),
	sanitizeBody("mobileNoAdmin").escape(),
	sanitizeBody("token").escape(),
	
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				AdminModel.findOne({$and:[{mobileNo : req.body.mobileNoAdmin},{token : req.body.token}]}).then(admin => {
					if (admin) {
						AlbumModel.find({albumstatus: req.body.albumstatus}).sort({_id:-1}).then(albums => {
							if (albums.length>0) {
								
									
								return apiResponse.successResponseWithData(res,"Albums Success.", albums);
							
						
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
 * Update Album.
 * 
 * @param {string}
 *            mobileNoAdmin
 * @param {string}
 *            albumTitle
 * @param {string}
 *            albumId
 * @param {string}
 *            albumFiles
 * @param {string}
 *            token
 * 
 * 
 * 
 * @returns {Object}
 */
exports.updateAlbum = [

	body("mobileNoAdmin").isLength({ min: 1 }).trim().withMessage("Username must be specified.")
		.isNumeric().withMessage("Username must be a valid Number."),
	
	
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),
	body("albumTitle").isLength({ min: 1 }).trim().withMessage("albumTitle must be specified."),
	body("albumFiles").isLength({ min: 1 }).trim().withMessage("albumFiles must be specified."),
	body("albumId").isLength({ min: 1 }).trim().withMessage("albumId must be specified."),
	sanitizeBody("albumId").escape(),
	sanitizeBody("albumTitle").escape(),
	//sanitizeBody("albumFiles").escape(),
	sanitizeBody("mobileNoAdmin").escape(),
	sanitizeBody("token").escape(),
	
	
	
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				AdminModel.findOne({$and:[{mobileNo : req.body.mobileNoAdmin},{token : req.body.token}]}).then(admin => {
					if (admin) {
						AlbumModel.findOne({_id:req.body.albumId}).then(album => {
							if (album) {
					
								album.albumTitle= decodeURIComponent(req.body.albumTitle);
								album.albumFiles= JSON.parse(req.body.albumFiles);
								album._id=req.body.albumId;
						album.save(function (err) {
							if (err) { return apiResponse.ErrorResponse(res, err); }
							
							return apiResponse.successResponseWithData(res,"Album Updated.", album);
						});
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
 * Update Album.
 * 
 * @param {string}
 *            mobileNoAdmin
 * @param {string}
 *            albumTitle
 * @param {string}
 *            albumId
 * @param {string}
 *            albumFiles
 * @param {string}
 *            token
 * 
 * 
 * 
 * @returns {Object}
 */
exports.updateAlbumStatus = [

	body("mobileNoAdmin").isLength({ min: 1 }).trim().withMessage("Username must be specified.")
		.isNumeric().withMessage("Username must be a valid Number."),
	
	
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),
	body("albumstatus").isLength({ min: 1 }).trim().withMessage("albumstatus must be specified."),
		body("albumId").isLength({ min: 1 }).trim().withMessage("albumId must be specified."),
	sanitizeBody("albumId").escape(),
	sanitizeBody("albumstatus").escape(),
	
	sanitizeBody("mobileNoAdmin").escape(),
	sanitizeBody("token").escape(),
	
	
	
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				AdminModel.findOne({$and:[{mobileNo : req.body.mobileNoAdmin},{token : req.body.token}]}).then(admin => {
					if (admin) {
						AlbumModel.findOne({_id:req.body.albumId}).then(album => {
							if (album) {
					
								album.albumstatus= req.body.albumstatus;
								
								album._id=req.body.albumId;
						album.save(function (err) {
							if (err) { return apiResponse.ErrorResponse(res, err); }
							
							return apiResponse.successResponseWithData(res,"Album Status Updated.", album);
						});
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
 * Album.
 * 
 * @param {string}
 *            mobileNoAdmin
 * 
 * @param {string}
 *            token
 * @param {string}
 *            albumId
 * 
 * 
 * @returns {Object}
 */
exports.album = [

	body("mobileNoAdmin").isLength({ min: 1 }).trim().withMessage("Username must be specified.")
		.isNumeric().withMessage("Username must be a valid Number."),
	
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),
	body("albumId").isLength({ min: 1 }).trim().withMessage("albumFiles must be specified."),
	sanitizeBody("albumId").escape(),
	sanitizeBody("mobileNoAdmin").escape(),
	sanitizeBody("token").escape(),
	
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				AdminModel.findOne({$and:[{mobileNo : req.body.mobileNoAdmin},{token : req.body.token}]}).then(admin => {
					if (admin) {
						AlbumModel.findOne({_id:req.body.albumId}).then(album => {
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


exports.addUser = [

	(req, res) => {
		
		const name = req.body.name;
		const fatherName = req.body.fatherName;
		const email = req.body.email;
		const dateOfBirth = req.body.dateOfBirth;
		const gender = req.body.gender;
		const maritalStatus = req.body.maritalStatus;
		const relationType = req.body.relationType;
		const mobileNo = req.body.mobileNo;
		const address = req.body.address;
		const area = req.body.area;
		const city = req.body.city;
		const state = req.body.state;
		const zipCode = req.body.zipCode;
		const qualification = req.body.qualification;
		const occupation = req.body.occupation;
		const addressProof = req.body.addressProof;
		const idProof = req.body.idProof;
		const profilePhoto = req.body.profilePhoto;

		const Userinfo = new UserModel({
			mobileNo: mobileNo,
			name: name,
			fatherName: fatherName,
			email: email,
			dateOfBirth: dateOfBirth,
			addressProof: addressProof,
			idProof: idProof,
			gender: gender,
			maritalStatus: maritalStatus,
			relationType: relationType,
			profilePhoto: profilePhoto,
			contactNumber: mobileNo,
			address: address,
			area: area,
			city: city,
			state: state,
			zipCode: zipCode,
			qualification: qualification,
			occupation: occupation
		})
		Userinfo.save()
			.then((doc) => {
				console.log(doc)
				if (doc) { res.status(200).json({ Message: "User info Has Been Added Successfully.", Result: doc, Status: "successfull" }) }
			}).catch((err) => {
				if (err) { res.status(200).json({ Message: "Error Occured During Operation", Result: err, Status: "Failed" }) }

			})
	}]


exports.getUserDetails = [

	(req, res) => {

		UserModel.findById({ _id: req.body.id }).populate("paymentRef")
			.then((document) => {
				if (document) {

					FamilyMembersModel.find({userId: document._id, status:true}).then(familyMembers => {

						PaymentsModel.find({userId: document._id}).then(payments => {

							MembershipHistory.find({userId: document._id}).then(membershipHistory => {
								return apiResponse.successResponseWithData(res,"User profile.", { user:document, familyMembers, payments, membershipHistory });
							});
							
						});
						
					});

				} else {
					res.status(200).json({ Message: "No User record present on this Id.", status: false })
				}
			})
			.catch((err) => {
				if (err) {
					res.status(200).json({ Message: "No User record present on this Id.", status: false })

				}
			})
	}]

exports.updateMemberShipStatus = [

	body("mobileNoAdmin").isLength({ min: 1 }).trim().withMessage("Mobile No must be specified.")
		.isNumeric().withMessage("Mobile No must be a valid Number."),
	
	
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),
	body("memberShipStatus").isLength({ min: 1 }).trim().withMessage("MemberShip must be specified."),
	body("id").isLength({ min: 1 }).trim().withMessage("Id must be specified."),

	sanitizeBody("memberShipStatus").escape(),
	sanitizeBody("id").escape(),
	sanitizeBody("mobileNoAdmin").escape(),
	sanitizeBody("token").escape(),

	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			} else {
				AdminModel.findOne({ $and: [{ mobileNo: req.body.mobileNoAdmin }, { token: req.body.token }] }).then(admin => {
					if (admin) {
						
						UserModel.findById({ _id: req.body.id })
							.then((member) => {
								if (member) {

									PaymentsModel.findOne({userId: member._id, status: "Pending"}).sort({createdAt:-1}).then(payments => {
										
										let oldIssueDate = member.issueDate;
										let oldExpiryDate = member.expiryDate;
										let oldPaymentRef = member.paymentRef;
										if(req.body.memberShipStatus === "Approved" && payments && payments.status === "Pending"){
											console.log("inside");
											const today = moment();
											member.issueDate = today;
											const expiryDate = today.add(parseInt(payments["paymentDuration"]), 'months');
											member.expiryDate = expiryDate;
										}
										
										member.memberShipStatus = req.body.memberShipStatus
										if (req.body.memberShipStatus === "Rejected" || req.body.memberShipStatus === "Renewal Rejected"){
											member.rejectionReason = req.body.reason;
										}
	
										member.save(function (err) {
											if (err) { return apiResponse.ErrorResponse(res, err); }

											if(req.body.memberShipStatus === "Approved" && payments){
												let updatingPaymentRef = payments._id;
												payments.status = "Approved";
												payments.save(function (err) {

													// to maintain membership history
													if(oldIssueDate && oldExpiryDate){
														var memberShiphistory = new MembershipHistory(
															{
																userId: member._id,
																paymentRef: oldPaymentRef ? oldPaymentRef : updatingPaymentRef,
																issueDate: oldIssueDate,
																expiryDate: oldExpiryDate
															}
														);
														memberShiphistory.save(function (err) {
															if (err) { return apiResponse.ErrorResponse(res, err); }
														});
													}

													return apiResponse.successResponseWithData(res, "Updated MemberShip Status Successfully", {});
												});
											} else {
												return apiResponse.successResponseWithData(res, "Updated MemberShip Status Successfully", {});
											}

										});

									});
									

								} else {
									res.status(200).json({ Message: "No User record present on this Id.", status: false })
								}
							})
							.catch((err) => {
								if (err) {
									res.status(200).json({ Message: "No User record present on this Id.", status: false })

								}
							})

					}
					else {
						return apiResponse.unauthorizedResponse(res, "Mobile Number or Token wrong.");
					}
				});

			}

		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}]


exports.updateMemberShipDate = [

	body("mobileNoAdmin").isLength({ min: 1 }).trim().withMessage("Mobile No must be specified.")
		.isNumeric().withMessage("Mobile No must be a valid Number."),
	
	
	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),
	body("issueDate").isLength({ min: 1 }).trim().withMessage("issueDate must be specified."),
	body("expiryDate").isLength({ min: 1 }).trim().withMessage("expiryDate must be specified."),
	body("id").isLength({ min: 1 }).trim().withMessage("Id must be specified."),

	sanitizeBody("issueDate").escape(),
	sanitizeBody("expiryDate").escape(),
	sanitizeBody("id").escape(),
	sanitizeBody("mobileNoAdmin").escape(),
	sanitizeBody("token").escape(),

	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			} else {
				AdminModel.findOne({ $and: [{ mobileNo: req.body.mobileNoAdmin }, { token: req.body.token }] }).then(admin => {
					if (admin) {
						
						UserModel.findById({ _id: req.body.id })
							.then((member) => {
								if (member) {

									member.issueDate = req.body.issueDate;
									member.expiryDate = req.body.expiryDate;
									member.save(function (err) {
										if (err) { return apiResponse.ErrorResponse(res, err); }
										return apiResponse.successResponseWithData(res, "Updated MemberShip Dates Successfully", {});

									});
									

								} else {
									res.status(200).json({ Message: "No User record present on this Id.", status: false })
								}
							})
							.catch((err) => {
								if (err) {
									res.status(200).json({ Message: "No User record present on this Id.", status: false })

								}
							})

					}
					else {
						return apiResponse.unauthorizedResponse(res, "Mobile Number or Token wrong.");
					}
				});

			}

		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}]

exports.usersListByMemberShipStatus = [

	body("mobileNoAdmin").isLength({ min: 1 }).trim().withMessage("Mobile No must be specified.")
		.isNumeric().withMessage("Mobile No must be a valid Number."),


	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),
	body("memberShipStatus").isLength({ min: 1 }).trim().withMessage("memberShipStatus must be specified."),

	sanitizeBody("memberShipStatus").escape(),
	sanitizeBody("mobileNoAdmin").escape(),
	sanitizeBody("token").escape(),

	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			} else {
				AdminModel.findOne({ $and: [{ mobileNo: req.body.mobileNoAdmin }, { token: req.body.token }] }).then(admin => {
					if (admin) {

						UserModel.find({ memberShipStatus: req.body.memberShipStatus }).then((members) => {
							return apiResponse.successResponseWithData(res, "MemberShip Retrived Successfully", members);
						})
						.catch((err) => {
							if (err) {
								res.status(200).json({ Message: "No User Found", status: false })
							}
						})

					}
					else {
						return apiResponse.unauthorizedResponse(res, "Mobile Number or Token wrong.");
					}
				});

			}

		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}]

exports.usersListByMemberShipStatusPagination = [

	body("mobileNoAdmin").isLength({ min: 1 }).trim().withMessage("Mobile No must be specified.")
		.isNumeric().withMessage("Mobile No must be a valid Number."),


	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),
	body("memberShipStatus").isLength({ min: 1 }).trim().withMessage("memberShipStatus must be specified."),

	sanitizeBody("memberShipStatus").escape(),
	sanitizeBody("mobileNoAdmin").escape(),
	sanitizeBody("token").escape(),

	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			} else {
				AdminModel.findOne({ $and: [{ mobileNo: req.body.mobileNoAdmin }, { token: req.body.token }] }).then(admin => {
					if (admin) {

						let membersQuery = [{ memberShipStatus: req.body.memberShipStatus }, { email: {$exists:true} }];
						if(req.body.search && req.body.search !== ''){
							membersQuery.push({ $or: [{ fullName: {$regex:req.body.search, $options: "i"} }, { mobileNo: {$regex:req.body.search, $options: "i"} }] });
						}
						membersQuery = { $and: membersQuery };

						let skip = req.body.skip ? parseInt(req.body.skip) : 0;
						let limit = req.body.limit ? parseInt(req.body.limit) : 50;

						UserModel.find(membersQuery,{},{ skip, limit }).sort({createdAt:-1}).then((members) => {

							var membershipAggregate = [
								{ $match: membersQuery },
								{ $group: { _id: "_id", count: { $sum: 1 } } }
							];
	
							UserModel.aggregate(membershipAggregate, (err, membershipResults) => {
								
								let membersCount = 0;
								if(membershipResults && membershipResults.length ===1 )
									membersCount = membershipResults[0]["count"];

								return apiResponse.successResponseWithData(res, "MemberShip Retrived Successfully", {members, membersCount});
							});

							
						})
						.catch((err) => {
							console.log(err);
							if (err) {
								res.status(200).json({ Message: "No User Found", status: false })
							}
						})

					}
					else {
						return apiResponse.unauthorizedResponse(res, "Mobile Number or Token wrong.");
					}
				});

			}

		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}]

exports.usersListByMemberShipExpiryDatePagination = [

	body("mobileNoAdmin").isLength({ min: 1 }).trim().withMessage("Mobile No must be specified.")
		.isNumeric().withMessage("Mobile No must be a valid Number."),


	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),

	sanitizeBody("mobileNoAdmin").escape(),
	sanitizeBody("token").escape(),

	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			} else {
				AdminModel.findOne({ $and: [{ mobileNo: req.body.mobileNoAdmin }, { token: req.body.token }] }).then(admin => {
					if (admin) {

						let membersQuery = [{ memberShipStatus: 'Approved' }, { email: {$exists:true} }, { expiryDate: {$exists:true} }];
						if(req.body.search && req.body.search !== ''){
							membersQuery.push({ $or: [{ fullName: {$regex:req.body.search, $options: "i"} }, { mobileNo: {$regex:req.body.search, $options: "i"} }] });
						}
						membersQuery = { $and: membersQuery };

						let skip = req.body.skip ? parseInt(req.body.skip) : 0;
						let limit = req.body.limit ? parseInt(req.body.limit) : 50;

						UserModel.find(membersQuery,{},{ skip, limit }).sort({expiryDate:1}).then((members) => {

							var membershipAggregate = [
								{ $match: membersQuery },
								{ $group: { _id: "_id", count: { $sum: 1 } } }
							];
	
							UserModel.aggregate(membershipAggregate, (err, membershipResults) => {
								
								let membersCount = 0;
								if(membershipResults && membershipResults.length ===1 )
									membersCount = membershipResults[0]["count"];

								return apiResponse.successResponseWithData(res, "MemberShip Retrived Successfully", {members, membersCount});
							});

							
						})
						.catch((err) => {
							console.log(err);
							if (err) {
								res.status(200).json({ Message: "No User Found", status: false })
							}
						})

					}
					else {
						return apiResponse.unauthorizedResponse(res, "Mobile Number or Token wrong.");
					}
				});

			}

		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}]

exports.deleteUser = [
	(req, res) => {
		UserModel.findByIdAndUpdate({ _id: req.body.id })
			.then((User) => {
				if (User) {

					User.status = 'InActive'

					User.save(
						(err) => {
							if (err) {
								res.status(200).json({ Message: "Error while updating User details", Status: false })
							} else {
								res.status(200).json({ Message: " User details update successfully", Status: true })
							}


						})
				}
			})
	}]

exports.deleteUserAccout = [

	body("mobileNoAdmin").isLength({ min: 1 }).trim().withMessage("Mobile No must be specified.")
		.isNumeric().withMessage("Mobile No must be a valid Number."),

	body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified."),
	body("accountNo").isLength({ min: 1 }).trim().withMessage("accountNo must be specified."),
	body("accountId").isLength({ min: 1 }).trim().withMessage("accountId must be specified."),

	sanitizeBody("accountNo").escape(),
	sanitizeBody("accountId").escape(),
	sanitizeBody("mobileNoAdmin").escape(),
	sanitizeBody("token").escape(),

	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			} else {
				AdminModel.findOne({ $and: [{ mobileNo: req.body.mobileNoAdmin }, { token: req.body.token }] }).then(admin => {
					if (admin) {

						UserModel.findOne({ _id: req.body.accountId, mobileNo: req.body.accountNo }).then(member => {
							
							if(member){
								UserHistoryModel.insertMany(member).then(insertedMember => {
									if(insertedMember){
										UserModel.deleteOne({_id: req.body.accountId, mobileNo: req.body.accountNo}).then(insertedMember => {
											res.status(200).json({ Message: "Deleted Successfully", status: true });
										});
									} else {
										console.log()
										res.status(200).json({ Message: "User Not deleted", status: false });
									}
								})
							} else {
								res.status(200).json({ Message: "No User Found", status: false });
							}

						}).catch((err) => {
							if (err) {
								res.status(200).json({ Message: "No User Found", status: false })
							}
						})

					}
					else {
						return apiResponse.unauthorizedResponse(res, "Mobile Number or Token wrong.");
					}
				});

			}

		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}]

exports.updateuserPersonalInfo = [
	(req, res) => {

		UserModel.findByIdAndUpdate({ _id: req.body.id })
			.then((User) => {
				if (User) {

					User.name = req.body.name;
					User.fatherName = req.body.fatherName;
					User.email = req.body.email;
					User.dateOfBirth = req.body.dateOfBirth;
					User.gender = req.body.gender;
					User.maritalStatus = req.body.maritalStatus;
					User.relationType = req.body.relationType;
					User.address = req.body.address;
					User.area = req.body.area;
					User.city = req.body.city;
					User.state = req.body.state;
					User.zipCode = req.body.zipCode;
					User.qualification = req.body.qualification;
					User.occupation = req.body.occupation;
					User.addressProof = req.body.addressProof;
					User.idProof = req.body.idProof;
					User.profilePhoto = req.body.profilePhoto;

					User.save(
						(err) => {
							if (err) {
								res.status(200).json({ Message: "Error while updating User details", Status: false })
							} else {
								res.status(200).json({ Message: " User details update successfully", Status: true })
							}


						})
				}
			})
	}]

exports.usersListByStatus = [

	(req, res) => {

		UserModel.find({ status: req.body.status })
			.then((users) => {
				if (users) {
					res.status(200).json({ list: users, status: true })
				}
			})
			.catch((err) => {
				if (err) {
					res.status(200).json({ Message: "No User", status: false })
				}
			})
	}]