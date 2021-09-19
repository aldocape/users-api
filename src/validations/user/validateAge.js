const { body, validationResult } = require("express-validator");

module.exports = body("age")
  .notEmpty()
  .withMessage("El campo edad no puede estar vacío")
  .bail()
  .isInt()
  .withMessage("Edad debe ser un número entero")
  .isFloat({ min: 18, max: 120 })
  .withMessage("Edad debe ser un valor entre 18 y 120");
