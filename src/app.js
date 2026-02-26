const express = require('express');
const authRoutes = require('./routes/authRoutes');
const snippetRoutes = require('./routes/snippetRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Parseo del cuerpo de la petición en formato JSON
app.use(express.json());

// Verificación de estado de la API 
app.get('/api/v1/health', (req, res) => {
  res.json({ success: true, message: 'DevLocker API está en funcionamiento' });
});

// Rutas de autenticación y gestión de snippets
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/snippets', snippetRoutes);

// Rutas no encontradas (404) 
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Ruta no encontrada' });
});

// Middleware global de errores 
app.use(errorHandler);

module.exports = app;
