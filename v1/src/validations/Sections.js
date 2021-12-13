const Joi = require('joi');

const createValidation = Joi.object({
  name: Joi.string().min(5).max(100).required(),
  project_id: Joi.string().required().min(8)
});
const updateValidation = Joi.object({
  name: Joi.string().min(5).max(100),
  project_id: Joi.string().min(8)
});

module.exports = {
  createValidation,
  updateValidation
};
