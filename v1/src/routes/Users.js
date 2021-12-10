const express = require("express");
const {
  create,
  index,
  login,
  update,
  destroy,
  projectList,
  resetPassword,
  changePassword,
  updateProfileImage
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
router.post(
  '/change-password',
  authenticate,
  validate(validationSchemas.changePasswordValidation),
  changePassword
);
router.post(
  '/update-profile-image',
  authenticate,

  updateProfileImage
);
router.get('/projects', authenticate, projectList);
router.delete('/delete/:id', authenticate, destroy);

module.exports = router;
