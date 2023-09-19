var mongoose = require("mongoose");

var EventProjectSchema = new mongoose.Schema({
	eventProjectName: {type: String, required: false},
	eventProjectPlace: {type: String, required: true},
	eventProjectDate: {type: Date, required:false},
	eventProjectDescription:{type: String, required: false},
	eventProjectNameLang: {type: String, required: false},
	eventProjectPlaceLang: {type: String, required: true},
	eventProjectDescriptionLang:{type: String, required: false},
	eventProjectCreatedBy:{type: String, required: false},
	eventProjectFileNames:{type: String, required: false},
	status: {type: Boolean, required: true, default: 1},
	eventProjectType: {type: String, required: true}
}, {timestamps: true});


module.exports = mongoose.model("EventProject", EventProjectSchema);