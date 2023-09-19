const { body,validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
// helper file to prepare responses.
const apiResponse = require("../helpers/apiResponse");
const utility = require("../helpers/utility");
// const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailer = require("../helpers/mailer");
const { constants } = require("../helpers/constants");
const logger = require("../helpers/logger");

const Jimp = require('jimp');

var multer  = require('multer');
var fs  = require('fs');
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        var dir = './uploads';
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        callback(null, dir);
    },
    filename: function (req, file, callback) {
        callback(null, Date.now()+file.originalname);
    }
});
//var upload = multer({storage: storage}).array('files', 12);
var upload = multer({storage: storage}).array('files', 12);

const sleep = ms => new Promise(r => setTimeout(r, ms));

/**
 * User fileUpload.
 
 */
exports.fileUpload = [
	
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				
				upload(req, res, async function (err) {
			        if (err) {
			        	return apiResponse.ErrorResponse(res, err);
			        }

					for (let file of req.files) {

						if(file.mimetype && file.mimetype.includes("image")){ 
							
							if(file.mimetype =="image/png" || file.mimetype =="image/jpeg" || file.mimetype =="image/jpg" ||
										file.mimetype =="image/gif"){
							
								let promises = [];
								let filepath = "./uploads/"+file.filename;
								let tempPath = filepath;
								let RESIZE_WIDTH = 1024; //px

								// console.log(file.filename);
								var promise = new Promise(async (resolve, reject) => {
									await Jimp.read(filepath)
										.then(image => {
											image
												.resize(RESIZE_WIDTH, Jimp.AUTO) // resize
												.writeAsync(tempPath)
												.then(async () => {
													resolve()
												})
										})
										.catch(err => {
											logger.logData("compress-error", "failed - image reading "+ file.filename + " "+ file.mimetype);
											// reject({ err: err })
											resolve();
										})
								});
								promises.push(promise);

								logger.logData("compress-success", "success "+ file.filename + " "+ file.mimetype);

							} else {
								logger.logData("compress-error", "failed "+ file.filename + " "+ file.mimetype);
							}
						}
						// await sleep(5000);
					}


			        return apiResponse.successResponseWithData(res,"File Success",req.files);
			        
				
			});
			}
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}];