const Joi = require("joi")

const getBospitalByStatus = Joi.object().keys({
    status: Joi.string().min(3).max(100).required()
})

module.exports = getBospitalByStatus