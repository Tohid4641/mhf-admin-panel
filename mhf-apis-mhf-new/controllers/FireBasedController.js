const { body,validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
// helper file to prepare responses.
const apiResponse = require("../helpers/apiResponse");
const utility = require("../helpers/utility");
// const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailer = require("../helpers/mailer");
const { constants } = require("../helpers/constants");
const FCM = require('fcm-node');

const serverKey = require('../helpers/mlaapp-5f3c3-firebase-adminsdk-dt1bx-cdb5306abb.json') ;//put the generated private key path here    

const fcm = new FCM(serverKey);




/**
 * User fileUpload.
 
 */
exports.sendNotification = [
body("msgTitle").isLength({ min: 1 }).trim().withMessage("msgTitle must be specified."),
body("msgBody").isLength({ min: 1 }).trim().withMessage("msgBody must be specified."),
sanitizeBody("msgTitle").escape(),
sanitizeBody("msgBody").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
			
		    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
		        to: 'registration_token', 
		        collapse_key: 'same_as_all',
		        
		        notification: {
		            title: req.body.msgTitle, 
		            body: req.body.msgBody 
		        },data: {  //you can send only notification or only data(or include both)
		            my_key: 'my value',
		            my_another_key: 'my another value'
		        }
		    };
		    
		    fcm.send(message, function(err, response){
		        if (err) {
		            console.log("Something has gone wrong!");
		            return apiResponse.ErrorResponse(res, err);
		        } else {
		            console.log("Successfully sent with response: ", response);
		            return apiResponse.successResponseWithData(res,"Successfully sent with response",response);
		        }
		    });
			}
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}];