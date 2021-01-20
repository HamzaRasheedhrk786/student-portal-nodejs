const Joi = require('joi');

// adding section record
const addSectionValidator = Joi.object({
    name: Joi.string().min(1).max(1).regex(/[A-Z]/).required()
})
// updating section record
const updateSectionValidator = Joi.object({
    name: Joi.string().min(1).max(1).regex(/[A-Z]/).required()
})

module.exports = {
    addSectionValidator,
    updateSectionValidator
}