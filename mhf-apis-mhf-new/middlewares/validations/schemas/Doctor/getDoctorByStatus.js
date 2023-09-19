const Joi = require("joi")

const getDoctorByStatus = Joi.object().keys({
    status: Joi.string().min(3).max(30).required()
})

module.exports = getDoctorByStatus