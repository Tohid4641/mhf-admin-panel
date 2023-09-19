var mongoose = require("mongoose");

var ContactNumberSchema = new mongoose.Schema({
	firstName: {type: String, required: false},
	lastName: {type: String, required: false},
	mobileNo: {type: String, required: true},
	role: {type: String, required: false},
	email: {type: String, required:false},
	address: {type: String, required: false},
	headOfService: {type: String, required: false},
	profilePhoto: {type: String, required: false},
	status: {type: Boolean, required: true, default: 1}
}, {timestamps: true});


module.exports = mongoose.model("ContactNumber", ContactNumberSchema);