var mongoose = require("mongoose");

var AdminSchema = new mongoose.Schema({
	fullName: {type: String, required: false},
	mobileNo: {type: String, required: true},
	confirmOTP: {type: String, required:false},
	token:{type: String, required: false},
	status: {type: Boolean, required: true, default: 1}
}, {timestamps: true});


module.exports = mongoose.model("Admin", AdminSchema);