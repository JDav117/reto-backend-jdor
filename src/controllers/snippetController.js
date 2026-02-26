const Snippet = require('../models/Snippet');
const asyncHandler = require('../utils/asyncHandler');

// ─────────────────────────────────────────────
// @route   POST /api/v1/snippets
// @desc    Crear un nuevo snippet para el usuario autenticado
// @access  Privado
// ─────────────────────────────────────────────
const createSnippet = asyncHandler(async (req, res) => {
  const { title, language, code, tags } = req.body;

  // El ID del usuario se extrae del token JWT (req.user), nunca del body
  const snippet = await Snippet.create({
    user: req.user._id,
    title,
    language,
    code,
    tags,
  });

  res.status(201).json({
    success: true,
    message: 'Snippet creado exitosamente',
    data: snippet,
  });
});

// ─────────────────────────────────────────────
// @route   GET /api/v1/snippets
// @desc    Obtener todos los snippets del usuario autenticado
// @access  Privado
// ─────────────────────────────────────────────
const getSnippets = asyncHandler(async (req, res) => {
  // Filtrar estrictamente por el ID del usuario autenticado
  const snippets = await Snippet.find({ user: req.user._id }).sort({
    createdAt: -1,
  });

  res.json({
    success: true,
    count: snippets.length,
    data: snippets,
  });
});

// ─────────────────────────────────────────────
// @route   PUT /api/v1/snippets/:id
// @desc    Actualizar un snippet (solo el dueño puede hacerlo)
// @access  Privado
// ─────────────────────────────────────────────
const updateSnippet = asyncHandler(async (req, res, next) => {
  // Buscar el snippet por ID y verificar que pertenece al usuario actual
  const snippet = await Snippet.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!snippet) {
    const error = new Error(
      'Snippet no encontrado o no tienes permiso para editarlo'
    );
    error.statusCode = 404;
    return next(error);
  }

  const { title, language, code, tags } = req.body;

  if (title !== undefined) snippet.title = title;
  if (language !== undefined) snippet.language = language;
  if (code !== undefined) snippet.code = code;
  if (tags !== undefined) snippet.tags = tags;

  const updated = await snippet.save();

  res.json({
    success: true,
    message: 'Snippet actualizado exitosamente',
    data: updated,
  });
});

// ─────────────────────────────────────────────
// @route   DELETE /api/v1/snippets/:id
// @desc    Eliminar un snippet (solo el dueño puede hacerlo)
// @access  Privado
// ─────────────────────────────────────────────
const deleteSnippet = asyncHandler(async (req, res, next) => {
  // Buscar el snippet por ID y verificar que pertenece al usuario actual
  const snippet = await Snippet.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!snippet) {
    const error = new Error(
      'Snippet no encontrado o no tienes permiso para eliminarlo'
    );
    error.statusCode = 404;
    return next(error);
  }

  await snippet.deleteOne();

  res.json({
    success: true,
    message: 'Snippet eliminado exitosamente',
    data: {},
  });
});

module.exports = { createSnippet, getSnippets, updateSnippet, deleteSnippet };
