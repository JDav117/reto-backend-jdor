/**
 * Envuelve un manejador de ruta asíncrono para capturar errores automáticamente
 * y pasarlos al middleware de errores de Express mediante next().
 * @param {Function} fn - Función controladora asíncrona
 * @returns {Function} Función middleware de Express
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
