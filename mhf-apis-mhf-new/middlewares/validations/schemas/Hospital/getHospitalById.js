const Joi = require("joi")

const getHospitalById = Joi.object().keys({
    hospital_id: Joi.string().min(3).max(100).required()
})

module.exports = getHospitalById