var mongoose = require("mongoose");

var AlbumSchema = new mongoose.Schema({
	albumTitle: {type: String, required: false},
	albumFiles: {type: String, required: true},
	albumCreatedBy: {type: String, required: true},
	albumstatus: {type: Boolean, required: true, default: 1}
}, {timestamps: true});

module.exports = mongoose.model("Album", AlbumSchema);