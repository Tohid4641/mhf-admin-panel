var mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId

var PaymentSchema = new mongoose.Schema({
    userId: { type: ObjectId, ref: "User", required: true },
    paymentType: { type: String, required:false},
    paymentId: { type: String, required:false},
    paymentReceipt: { type: String, required:false},
    paymentDuration: { type: Number, required:false},
    status: { type: String, default: "Pending", required:false}
}, {timestamps: true});


module.exports = mongoose.model("Payment", PaymentSchema);
