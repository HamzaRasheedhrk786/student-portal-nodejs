const Joi = require('joi');


const addStudentValidator = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    class: Joi.string().required(),
    registration: Joi.string().min(11).max(11).regex(/[\d]{2}-[ntu|NTU]{3}-[\d]{4}/).required(),
    email: Joi.string().email().required(),
    password: Joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/).min(8).required()

})
const loginStudentValidator = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/).min(8).required()
})

module.exports = {
    addStudentValidator,
    loginStudentValidator
}