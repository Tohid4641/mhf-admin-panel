var mongoose = require("mongoose");

var ComplaintSchema = new mongoose.Schema({
	complaintTitle: {type: String, required: false},
	complaintNumber: {type: String, required: false},
	complaintDescription: {type: String, required: true},
	complaintReportType: {type: String, required:false},
	complaintLocation:{type: String, required: false},
	complaintDepartmentName:{type: String, required: false},
	complaintFileNames:{type: String, required: false},
	complaintCreatedBy:{type: String, required: false},
	complaintReplyBy:{type: String, required: false},
	complaintReplyDescription: {type: String, required: false},
	complaintPublish: {type: String, required: false},
	complaintStatus: {type: String, required: false},
	status: {type: Boolean, required: true, default: 1}
	
}, {timestamps: true});


module.exports = mongoose.model("Complaint", ComplaintSchema);