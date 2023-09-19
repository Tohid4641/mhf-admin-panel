var mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId

var UserSchema = new mongoose.Schema({
    memberShipId: {type: String, required: false},
	fullName: {type: String, required: false},
	mobileNo: {type: String, required: true},
	voterId: {type: String, required: false},
	confirmOTP: {type: String, required:false},
	userAddress: {type: String, required: false},
	userPhoto: {type: String, required: false},
	token:{type: String, required: false},
	status: {type: String, required: true, default: 'Active'},
    memberShipStatus: {
        type: String,
        enum: ["Approved", "Pending", "Rejected"],
        default: 'Pending'
    },
    rejectionReason: { type: String },
    paymentRef: { type: ObjectId, ref: "Payment", required: false },
    issueDate: { type: Date },
    expiryDate: { type: Date },
	name: { type: String },
    fatherName: { type: String },
    email: { type: String },
    dateOfBirth: { type: Date },
    addressProof: { type: String },
    electionId: { type: String },
    idProof: { type: String },
    aadhar: { type: String },
    gender: {
        type: String,
        enum: ["male", "female"]
    },
    maritalStatus: {
        type: String,
        enum: ["Single", "Married", "Widow", "Divorce", ]
    },
    relationType: { type: String, enum: ["Father",  "Mother", "Husband", "Wife"] },
    profilePhoto: { type: String },
    contactNumber: { type: Number },
    address: { type: String },
    area: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: Number },
    qualification: {
        type: String,
        enum: ["Matriculate", "Postgraduate", "Undergraduate", "Professional", ]
    },
    occupation: {
        type: String,
        enum: ["Farmer", "Self employed", "Doctor"]
    },
    reference: { type: String },
    renewal: {type: Boolean, required: true, default: false}
}, {timestamps: true});


module.exports = mongoose.model("User", UserSchema);