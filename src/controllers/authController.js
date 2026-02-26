const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Genera un JWT firmado para el ID de usuario proporcionado.
 */
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

// ─────────────────────────────────────────────
// @route   POST /api/v1/auth/register
// @desc    Registrar un nuevo usuario
// @access  Público
// ─────────────────────────────────────────────
const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('El usuario ya existe con ese correo');
  }

  const user = await User.create({ username, email, password });

  res.status(201).json({
    success: true,
    message: 'Usuario registrado exitosamente',
    token: generateToken(user._id),
    data: {
      _id: user._id,
      username: user.username,
      email: user.email,
    },
  });
});

// ─────────────────────────────────────────────
// @route   POST /api/v1/auth/login
// @desc    Autenticar usuario y retornar JWT
// @access  Público
// ─────────────────────────────────────────────
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Correo o contraseña incorrectos');
  }

  res.json({
    success: true,
    message: 'Inicio de sesión exitoso',
    token: generateToken(user._id),
    data: {
      _id: user._id,
      username: user.username,
      email: user.email,
    },
  });
});

module.exports = { register, login };
