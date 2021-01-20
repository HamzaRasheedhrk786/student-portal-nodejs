const Joi = require('joi');


const signUpAdminValidator = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,"Minimum 8 characters required including uppercase,lowercase & intergers").min(8).required()
})
const loginAdminValidator = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,"Minimum 8 characters required including uppercase,lowercase & intergers").min(8).required()
})


module.exports = {
    signUpAdminValidator,
    loginAdminValidator
}