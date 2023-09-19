const Joi = require("joi")

const updateDoctorStatus = Joi.object().keys({
    doctor_id: Joi.string().min(3).max(30).required(),
    status: Joi.string().min(3).max(30).required()
})

module.exports = updateDoctorStatus