const Joi = require("joi")

const getDoctorById = Joi.object().keys({
    doctor_id: Joi.string().min(3).max(30).required()
})

module.exports = getDoctorById