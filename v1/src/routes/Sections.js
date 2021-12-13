const express = require('express');
const { create, index, update, destroy, detail } = require('../controllers/Sections');
const authenticate = require('../middlewares/authenticate');
const validate = require('../middlewares/validate');
const validationSchemas = require('../validations/Sections');

const router = express.Router();

router.get('/:projectId', authenticate, index);
router.post('/create', authenticate, validate(validationSchemas.createValidation), create);
router.get('/detail/:sectionId', authenticate, detail);
router.put('/update/:id', authenticate, validate(validationSchemas.updateValidation), update);
router.delete('/delete/:id', authenticate, destroy);

module.exports = router;
