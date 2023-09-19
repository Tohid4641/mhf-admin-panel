const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const donationSchema = new mongoose.Schema({
    user: { type: ObjectId, ref: "User" },
    mobileNo: { type: String },
    amount: { type: String },
    receipt: { type: String },
    orderId: { type: String },
    paymentId: { type: String },
    signature: { type: String },
    currency: { type: String },
    status:{type:String,enum:["ACTIVE","INACTIVE", "PENDING"],default:"INACTIVE",required:false}
}, { timestamps: true });


module.exports = mongoose.model("Donations", donationSchema, "donations")