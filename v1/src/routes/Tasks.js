const express = require('express');
const {
  create,
  index,
  update,
  destroy,
  detail,
  makeComment,
  deleteComment,
  addSubTask
} = require('../controllers/Tasks');
const authenticate = require('../middlewares/authenticate');
const validate = require('../middlewares/validate');
const validationSchemas = require('../validations/Tasks');

const router = express.Router();

router.get('/:projectId', authenticate, index);
router.post('/create', authenticate, validate(validationSchemas.createValidation), create);
router.get('/detail/:id', authenticate, detail);
router.put('/update/:id', authenticate, validate(validationSchemas.updateValidation), update);
router.put(
  '/make-comment/:id',
  authenticate,
  validate(validationSchemas.commentValidation),
  makeComment
);
router.put(
  '/delete-comment/:id',
  authenticate,
  validate(validationSchemas.commentDeleteValidation),
  deleteComment
);
router.post(
  '/add-sub-task/:id',
  authenticate,
  validate(validationSchemas.subTaskValidation),
  addSubTask
);
router.delete('/delete/:id', authenticate, destroy);

module.exports = router;
