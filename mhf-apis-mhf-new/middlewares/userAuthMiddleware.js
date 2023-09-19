const jwt = require('jsonwebtoken')
const UserModel = require('../models/UserModel')

const apiResponse = require("../helpers/apiResponse");
const { body, validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");

const accessTokenSecreat = 'yourSecreatAccessToken'
const userCheckingHeaders = function (req, res, next) {
    
    body("mobileNo").isLength({ min: 1 }).trim().withMessage("Username must be specified.")
        .isNumeric().withMessage("Username must be a valid Number.");
        body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified.");

        sanitizeBody("mobileNo").escape();
        sanitizeBody("token").escape();
    
        try {
            // console.log(req.body);
            const errors = validationResult(req);
            // console.log(errors);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
            } else {
                
                UserModel.findOne({$and:[{mobileNo : req.body.mobileNo},{token : req.body.token}]}).then(user => {
                    
                    if (user) {

                        req.user = user;
                        next();

                    } else {
                        return apiResponse.unauthorizedResponse(res, "Mobile Number or Token wrong.");
                    }

                });
            }
        } catch (err) {
            return apiResponse.ErrorResponse(res, err);
        }

}



module.exports = {
    userCheckingHeaders: userCheckingHeaders
}