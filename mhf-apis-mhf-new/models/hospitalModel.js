const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
    name_of_hospital: { type: String },
    what_kind_of_hospital: { type: String },
    about_the_hospital: { type: String },
    address_of_hospital: { type: String },
    list_of_services_the_hospital_provides: { type: String },
    timings_of_hospital:{type:String},
    contact: { type: String },
    status:{type:String,enum:["ACTIVE","INACTIVE"],default:"ACTIVE",required:false}
}, { timestamps: true });


module.exports = mongoose.model("Hospital", hospitalSchema, "hospitals")