const Joi = require("joi");

const createValidation = Joi.object({
  full_name: Joi.string().min(5).max(100).required(),
  password: Joi.string().min(8).max(100).required(),
  email: Joi.string().min(8).max(100).required().email(),
});
const loginValidation = Joi.object({
  password: Joi.string().min(8).max(100).required(),
  email: Joi.string().min(8).max(100).required().email(),
});

module.exports = {
  createValidation,
  loginValidation,
};
