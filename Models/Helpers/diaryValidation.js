const Joi = require('joi');


const addDiaryValidator = Joi.object({
    clasS: Joi.string().required(),
    image: Joi.string().required()
})


module.exports = {
    addDiaryValidator
}