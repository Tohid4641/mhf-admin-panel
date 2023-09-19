const Joi = require("joi")

const getDoctorByName = Joi.object().keys({
    name: Joi.string().min(2).max(30).required()
})

module.exports = getDoctorByName