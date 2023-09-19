var express = require("express");
const FireBasedController = require("../controllers/FireBasedController");

var router = express.Router();
router.post("/send_notification", FireBasedController.sendNotification);

module.exports = router;