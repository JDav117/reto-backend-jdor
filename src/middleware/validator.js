const { validationResult } = require('express-validator');

/**
 * Middleware que centraliza la lectura de errores de express-validator.
 * Se coloca entre las reglas de validación y el controlador en la ruta.
 * Si hay errores, corta la cadena y retorna 400 con un JSON estructurado.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  const extractedErrors = errors
    .array()
    .map((err) => ({ [err.path]: err.msg }));

  return res.status(400).json({
    success: false,
    message: 'Error de validación',
    errors: extractedErrors,
  });
};

module.exports = { validate };
