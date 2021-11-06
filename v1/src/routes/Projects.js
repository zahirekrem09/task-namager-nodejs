const express = require("express");
const { create, index } = require("../controllers/Projects");
const authenticate = require("../middlewares/authenticate");
const validate = require("../middlewares/validate");
const validationSchemas = require("../validations/Projects");

const router = express.Router();

router.get("/", authenticate, index);
router.post(
  "/create",
  authenticate,
  validate(validationSchemas.createValidation),
  create
);

module.exports = router;
