var mongoose = require("mongoose");

var ComplaintLogSchema = new mongoose.Schema({
	complaintId: {type: String, required: true},
	complaintStatus: {type: String, required: true},
	complaintLogCreatedBy: {type: String, required: true},
	status: {type: Boolean, required: true, default: 1}
}, {timestamps: true});


module.exports = mongoose.model("ComplaintLog", ComplaintLogSchema);