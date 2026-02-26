/**
 * Middleware global para el manejo de errores.
 * Retorna una respuesta JSON consistente ante cualquier error.
 */
const errorHandler = (err, req, res, next) => {
  // Usar el statusCode del error, o el que se haya establecido en res.status(),
  // o 500 como último recurso
  let statusCode =
    err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);
  let message = err.message || 'Error interno del servidor';

  // ObjectId inválido de Mongoose
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Recurso no encontrado';
  }

  // Clave duplicada en Mongoose
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `Valor duplicado para el campo: ${field}`;
  }

  // Error de validación de Mongoose
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }

  // Errores de JWT
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token inválido';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expirado';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
