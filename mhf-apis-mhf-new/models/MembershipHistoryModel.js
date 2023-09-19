var mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId

var MembershipHistorySchema = new mongoose.Schema({
    userId: { type: ObjectId, ref: "User", required: true },
    paymentRef: { type: ObjectId, ref: "Payment", required: true },
    issueDate: { type: Date },
    expiryDate: { type: Date },
    status: { type: String, default: "Active", required:false}
}, {timestamps: true});


module.exports = mongoose.model("MembershipHistory", MembershipHistorySchema);
