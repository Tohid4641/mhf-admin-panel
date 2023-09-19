var mongoose = require("mongoose");

var DepartmentSchema = new mongoose.Schema({
	departmentName: {type: String, required: true},
	departmentCreatedBy: {type: String, required: true},
	status: {type: Boolean, required: true, default: 1}
}, {timestamps: true});


module.exports = mongoose.model("Department", DepartmentSchema);