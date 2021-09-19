const { body, validationResult } = require("express-validator");

module.exports = body("name")
  .notEmpty()
  .withMessage("El campo nombre no debe estar vacío")
  .bail()
  .isLength({ min: 3 })
  .withMessage("El nombre de usuario debe tener por lo menos 3 caracteres");
