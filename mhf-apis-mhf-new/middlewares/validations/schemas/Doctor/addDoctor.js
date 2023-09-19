const Joi = require("joi")

const addDoctorSchema = Joi.object().keys({
    name_of_doctor: Joi.string().min(3).max(30).required(),
    qualification: Joi.string(),
    designation: Joi.string(),
    about_doctor: Joi.string(),
    contact: Joi.string(),
    list_of_hospitals_working: Joi.string()
})

module.exports = addDoctorSchema