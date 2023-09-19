const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const date = new Date()
const D = date.toDateString()



const MemberTypeSchema = new mongoose.Schema({

    planDuration: { type: String, enum: ["Six months plan", "One year plan"] },
    ActivationDate: { type: String, default: D },
    DeactivationDate: { type: String, default: D },
    userId: { type: ObjectId, ref: 'User' },
    MemberStatus: { type: String, enum: ['Active', 'Deactive'] }

})

module.exports = mongoose.model('MembershipType', MemberTypeSchema);


