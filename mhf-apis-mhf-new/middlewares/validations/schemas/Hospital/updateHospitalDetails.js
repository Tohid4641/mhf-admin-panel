const Joi = require("joi")

const updateHospitalDetailsSchema = Joi.object().keys({
    hospital_id: Joi.string().min(3).max(100).required(),
    name_of_hospital: Joi.string(),
    address_of_hospital: Joi.string(),
    what_kind_of_hospital: Joi.string(),
    about_the_hospital: Joi.string(),
    list_of_services_the_hospital_provides: Joi.string(),
    timings_of_hospital: Joi.string(),
    contact: Joi.string(),
    status: Joi.string().min(3).max(30)
    
})

module.exports = updateHospitalDetailsSchema