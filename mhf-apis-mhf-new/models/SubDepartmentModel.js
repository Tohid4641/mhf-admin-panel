var mongoose = require("mongoose");

var SubDepartmentSchema = new mongoose.Schema({
	subDepartmentName: {type: String, required: true},
	subDepartmentCreatedBy: {type: String, required: true},
	departmentId: {type: String, required: true},
	status: {type: Boolean, required: true, default: 1}
}, {timestamps: true});


module.exports = mongoose.model("SubDepartment", SubDepartmentSchema);