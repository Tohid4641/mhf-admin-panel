const Joi = require("joi")

const addHospitalSchema = Joi.object().keys({
    name_of_hospital: Joi.string().min(3).max(100).required(),
    address_of_hospital: Joi.string(),
    what_kind_of_hospital: Joi.string(),
    about_the_hospital: Joi.string(),
    list_of_services_the_hospital_provides: Joi.string(),
    timings_of_hospital: Joi.string(),
    contact: Joi.string()
})

module.exports = addHospitalSchema