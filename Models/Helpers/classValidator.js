const Joi = require('joi');

// adding class
const addClassValidator = Joi.object({
    section: Joi.string().required(),
    standard: Joi.string().required(),
    teacher: Joi.string()
})
// updating class
const updateClassValidator = Joi.object({
    teacher: Joi.string().required()
})

module.exports = {
    addClassValidator,
    updateClassValidator
}