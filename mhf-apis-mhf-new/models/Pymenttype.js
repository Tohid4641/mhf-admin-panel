const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const date = new Date()
const D = date.toDateString()
var T = new Date().toLocaleTimeString()



const paymentTypeSchema = new mongoose.Schema({

    paymentType: { type: String },
    userId: { type: ObjectId, ref: "User", required: false },
    transactionDate: { type: String, default: D },
    time: { type: String, default: T },
    amount: { type: Number, required: true },
    transactionChannel: { type: String },
    paymentReceipt: { type: String }
})

module.exports = mongoose.model("PaymentType", paymentTypeSchema)