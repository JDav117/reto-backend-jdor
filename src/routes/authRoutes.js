const express = require('express');
const { body } = require('express-validator');
const { register, login } = require('../controllers/authController');
const { validate } = require('../middleware/validator');

const router = express.Router();

// Reglas de validación para el registro
const registerValidation = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('El nombre de usuario es obligatorio')
    .isLength({ min: 3 })
    .withMessage('El nombre de usuario debe tener mínimo 3 caracteres'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('El correo es obligatorio')
    .isEmail()
    .withMessage('Por favor ingresa un correo válido'),
  body('password')
    .notEmpty()
    .withMessage('La contraseña es obligatoria')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener mínimo 6 caracteres'),
];

// Reglas de validación para el inicio de sesión
const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('El correo es obligatorio')
    .isEmail()
    .withMessage('Por favor ingresa un correo válido'),
  body('password').notEmpty().withMessage('La contraseña es obligatoria'),
];

router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);

module.exports = router;
