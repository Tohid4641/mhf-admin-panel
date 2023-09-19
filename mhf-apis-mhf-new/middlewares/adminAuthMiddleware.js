const jwt = require('jsonwebtoken')
const AdminModel = require('../models/AdminModel')

const apiResponse = require("../helpers/apiResponse");
const { body, validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");

const accessTokenSecreat = 'yourSecreatAccessToken'
const adminCheckingHeaders = function (req, res, next) {
    
    body("mobileNoAdmin").isLength({ min: 1 }).trim().withMessage("Username must be specified.")
        .isNumeric().withMessage("Username must be a valid Number.");
        body("token").isLength({ min: 1 }).trim().withMessage("Token must be specified.");

        sanitizeBody("mobileNoAdmin").escape();
        sanitizeBody("token").escape();
    
        try {
            // console.log(req.body);
            const errors = validationResult(req);
            // console.log(errors);
            if (!errors.isEmpty()) {
                return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
            } else {
                
                AdminModel.findOne({ $and: [{ mobileNo: req.body.mobileNoAdmin }, { token: req.body.token }] }).then(admin => {
                    
                    if (admin) {

                        req.admin = admin;
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
    adminCheckingHeaders: adminCheckingHeaders
}