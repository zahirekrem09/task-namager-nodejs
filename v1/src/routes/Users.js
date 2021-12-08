const express = require("express");
const {
  create,
  index,
  login,
  update,
  projectList,
  resetPassword
} = require('../controllers/Users');
const authenticate = require('../middlewares/authenticate');
const validate = require('../middlewares/validate');
const validationSchemas = require('../validations/Users');

const router = express.Router();

router.get('/', index);
router.post('/create', validate(validationSchemas.createValidation), create);
router.post('/login', validate(validationSchemas.loginValidation), login);
router.patch('/update', authenticate, validate(validationSchemas.updateValidation), update);
router.post('/reset-password', validate(validationSchemas.resetPasswordValidation), resetPassword);
router.get('/projects', authenticate, projectList);

module.exports = router;
