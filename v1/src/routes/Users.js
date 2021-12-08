const express = require("express");
const { create, index, login, projectList } = require('../controllers/Users');
const authenticate = require('../middlewares/authenticate');
const validate = require('../middlewares/validate');
const validationSchemas = require('../validations/Users');

const router = express.Router();

router.get('/', index);
router.post('/create', validate(validationSchemas.createValidation), create);
router.post('/login', validate(validationSchemas.loginValidation), login);
router.get('/projects', authenticate, projectList);

module.exports = router;
