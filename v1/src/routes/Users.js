const express = require("express");
const { create, index, login } = require("../controllers/Users");
const validate = require("../middlewares/validate");
const validationSchemas = require("../validations/Users");

const router = express.Router();

router.get("/", index);
router.post("/create", validate(validationSchemas.createValidation), create);
router.post("/login", validate(validationSchemas.loginValidation), login);

module.exports = router;
