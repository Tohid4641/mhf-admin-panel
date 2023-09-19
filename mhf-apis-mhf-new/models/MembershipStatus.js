const mongoose = require("mongoose")

const date = new Date()
const D = date.toDateString()

const membershipSchema = new mongoose.Schema({

    membershipStatus: { type: String, default: "pending" },
    dateOfApplication: { type: String, default: D },
    reviewedBy: { String},
    reviewerComments: String,
    reviewDate: { type: String, default: D },
    approvalDate: { type: String, default: D },
    approvedBy: String,
    rejected: String, 
    reasonsForRejection: String 

})


module.exports = mongoose.model("MembershipStatus", membershipSchema)