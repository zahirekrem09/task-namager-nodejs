const Joi = require("joi");

const createValidation = Joi.object({
  full_name: Joi.string().min(5).max(100).required(),
  password: Joi.string().min(8).max(100).required(),
  email: Joi.string().min(8).max(100).required().email()
});
const updateValidation = Joi.object({
  full_name: Joi.string().min(5).max(100).required()
});
const loginValidation = Joi.object({
  password: Joi.string().min(8).max(100).required(),
  email: Joi.string().min(8).max(100).required().email()
});
const resetPasswordValidation = Joi.object({
  email: Joi.string().min(8).max(100).required().email()
});
const changePasswordValidation = Joi.object({
  password: Joi.string().min(8).max(100).required()
});

module.exports = {
  createValidation,
  loginValidation,
  resetPasswordValidation,
  updateValidation,
  changePasswordValidation
};
