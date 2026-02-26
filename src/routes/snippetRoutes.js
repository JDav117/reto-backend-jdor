const express = require('express');
const { body } = require('express-validator');
const {
  createSnippet,
  getSnippets,
  updateSnippet,
  deleteSnippet,
} = require('../controllers/snippetController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validator');

const router = express.Router();

// Todas las rutas de snippets están protegidas por autenticación JWT
router.use(protect);

// Reglas de validación para crear un snippet
const createValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('El título es obligatorio')
    .isLength({ min: 3 })
    .withMessage('El título debe tener mínimo 3 caracteres'),
  body('code').notEmpty().withMessage('El contenido del código es obligatorio'),
  body('language').optional().trim(),
  body('tags').optional().isArray().withMessage('Los tags deben ser un arreglo'),
];

// Reglas de validación para actualizar un snippet (todos los campos son opcionales)
const updateValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage('El título debe tener mínimo 3 caracteres'),
  body('code').optional(),
  body('language').optional().trim(),
  body('tags').optional().isArray().withMessage('Los tags deben ser un arreglo'),
];

router.route('/').post(createValidation, validate, createSnippet).get(getSnippets);

router
  .route('/:id')
  .put(updateValidation, validate, updateSnippet)
  .delete(deleteSnippet);

module.exports = router;
