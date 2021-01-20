const Joi = require('joi');


const addTeacherValidator = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    education: Joi.string().required(),
    subject:Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/).min(8).required()

})
const loginTeacherValidator = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/).min(8).required()
})
const updateTeacherValidator = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    education: Joi.string().required(),
    subject:Joi.string().required(),
})

module.exports = {
    addTeacherValidator,
    loginTeacherValidator,
    updateTeacherValidator
}