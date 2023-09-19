var express = require("express");
const FileUploadController = require("../controllers/FileUploadController");

var router = express.Router();
router.post("/file_upload", FileUploadController.fileUpload);



module.exports = router;