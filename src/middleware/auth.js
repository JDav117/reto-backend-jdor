const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Protege las rutas - verifica el JWT del encabezado Authorization.
 * Adjunta el usuario autenticado en req.user.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('No autorizado, no se proporcionó token');
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id);
  if (!user) {
    res.status(401);
    throw new Error('No autorizado, el usuario ya no existe');
  }

  req.user = user;
  next();
});

module.exports = { protect };
