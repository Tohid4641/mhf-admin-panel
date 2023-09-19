const _ = require('lodash')
const Joi = require('joi')
    //import Schemas from './schemas'
const Schemas = require('./schemas')
module.exports = (useJoiError = false) => {
    // useJoiError determines if we should respond with the base Joi error
    // boolean: defaults to false
    const _useJoiError = _.isBoolean(useJoiError) && useJoiError
        // enabled HTTP methods for request data validation
    const _supportedMethods = ['post', 'put', 'get', 'delete']
        // Joi validation options
    const _validationOptions = {
            abortEarly: false, // abort after the last validation error
            allowUnknown: true, // allow unknown keys that will be ignored
            stripUnknown: true // remove unknown keys from the validated data
        }
        // return the validation middleware
    return (req, res, next) => {
        const route = req.route.path
        const method = req.method.toLowerCase()
            // console.log(route, method)
        if (_.includes(_supportedMethods, method) && _.has(Schemas, route)) {
            // get schema for the current route
            let _schema = _.get(Schemas, route)
            if (_schema && _schema.multi) {
                _schema = _schema[method]
            }
            const data = {...req.query, ...req.params, ...req.body }
                // console.log(data)

            if (_schema) {
                //console.log(_schema)
                // Validate req.body using the schema and validation options
                Joi.validate(data, _schema, _validationOptions, function(err, data) {

                    if (err) {
                        // Joi Error
                        console.log({ err })
                        const JoiError = {
                                success: false,
                                errors: {
                                    original: err._object,
                                    // fetch only message and type from each error
                                    details: _.map(err.details, ({ message, type, context }) => ({
                                        key: context.key,
                                        message: message.replace(/['"]/g, ''),
                                        type
                                    }))
                                }
                            }
                            // Custom Error
                        const CustomError = {
                                status: 'failed',
                                error: 'Invalid request data. Please review request and try again.'
                            }
                            // Send back the JSON error response
                        res.status(422).json(_useJoiError ? JoiError : CustomError)
                    } else {
                        // Replace req.body with the data after Joi validation
                        //    console.log({ data })
                        req.body = data
                        next()
                    }

                })

            }
        }
    }
    next()
}