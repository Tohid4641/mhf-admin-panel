const Joi = require("joi")

const updateDoctorDetailsSchema = Joi.object().keys({
    doctor_id: Joi.string().min(3).max(50).required(),
    name_of_doctor: Joi.string(),
    qualification: Joi.string(),
    designation: Joi.string(),
    about_doctor: Joi.string(),
    contact: Joi.string(),
    list_of_hospitals_working: Joi.string()
})

module.exports = updateDoctorDetailsSchema