const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    name_of_doctor: { type: String },
    qualification: { type: String },
    designation: { type: String },
    about_doctor: { type: String },
    list_of_hospitals_working: { type: String },
    contact: { type: String },
    status:{type:String,enum:["ACTIVE","INACTIVE"],default:"ACTIVE",required:false}
}, { timestamps: true });


module.exports = mongoose.model("Doctor", doctorSchema, "doctors")