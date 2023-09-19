var mongoose = require("mongoose");

var ContactUsSchema = new mongoose.Schema({
	mobileNo: {type: String, required: true},
	status: {type: Boolean, required: true, default: 1}
}, {timestamps: true});


module.exports = mongoose.model("ContactUs", ContactUsSchema);