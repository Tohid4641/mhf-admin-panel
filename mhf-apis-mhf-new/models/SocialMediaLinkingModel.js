var mongoose = require("mongoose");

var SocialMediaLinkingSchema = new mongoose.Schema({
	socialMediaType: {type: String, required: true},
	socialMediaTypeUrl: {type: String, required: true},
	socialMediaTypeCreatedBy: {type: String, required: true},
	status: {type: Boolean, required: true, default: 1}
}, {timestamps: true});


module.exports = mongoose.model("SocialMediaLinking", SocialMediaLinkingSchema);