const Joi = require('joi');

const createValidation = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(3).max(1000).required(),
  project_id: Joi.string().required().min(8),
  section_id: Joi.string().required().min(8),
  due_date: Joi.date(),
  is_completed: Joi.boolean(),
  comments: Joi.array(),
  description: Joi.string().min(3).max(1000),
  statuses: Joi.array().items(Joi.string().min(3).max(100)),
  assigned_to: Joi.string().min(8)
});
const updateValidation = Joi.object({
  title: Joi.string().min(3).max(100),
  project_id: Joi.string().min(8),
  section_id: Joi.string().min(8),
  due_date: Joi.date(),
  is_completed: Joi.boolean(),
  comments: Joi.array(),
  description: Joi.string().min(3).max(1000),
  statuses: Joi.array().items(Joi.string().min(3).max(100)),
  assigned_to: Joi.string().min(8)
});
const commentValidation = Joi.object({
  comment: Joi.string().min(3).max(1000).required()
});
const commentDeleteValidation = Joi.object({
  id: Joi.string().min(8).required()
});
const subTaskValidation = Joi.object({
  title: Joi.string().min(3).max(100).required(),

  due_date: Joi.date(),
  is_completed: Joi.boolean(),
  comments: Joi.array(),
  description: Joi.string().min(3).max(1000),
  statuses: Joi.array().items(Joi.string().min(3).max(100)),
  assigned_to: Joi.string().min(8)
});

module.exports = {
  createValidation,
  updateValidation,
  commentValidation,
  commentDeleteValidation,
  subTaskValidation
};
