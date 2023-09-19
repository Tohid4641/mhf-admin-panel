var mongoose = require("mongoose");

var MLASchema = new mongoose.Schema({
	fullName: {type: String, required: false},
	mobileNo: {type: String, required: true},
	qualification: {type: String, required: false},
	aboutMLA: {type: String, required: false},
	mlaPhoto: {type: String, required: false},
	status: {type: Boolean, required: true, default: 1}
}, {timestamps: true});


module.exports = mongoose.model("MLA", MLASchema);