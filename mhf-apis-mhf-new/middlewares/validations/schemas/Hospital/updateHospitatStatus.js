const Joi = require("joi")

const updateHospitatStatus = Joi.object().keys({
    hospital_id: Joi.string().min(3).max(100).required(),
    status: Joi.string().min(3).max(100).required()
})

module.exports = updateHospitatStatus