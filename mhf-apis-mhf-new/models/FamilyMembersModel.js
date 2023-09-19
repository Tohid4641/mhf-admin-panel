var mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

var FamilyMembersSchema = new mongoose.Schema({
    userId: { type: ObjectId, ref: "User", required: false },
	name: {type: String, required: false},
	relation: {type: String, required: false},
	idproof: {type: String, required: false},
	status: {type: Boolean, required: true, default: 1}
}, {timestamps: true});


module.exports = mongoose.model("FamilyMembers", FamilyMembersSchema);