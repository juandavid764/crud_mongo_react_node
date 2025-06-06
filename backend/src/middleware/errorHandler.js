/**
 * Middleware de manejo de errores
 * Centraliza el manejo de errores de la aplicación
 */

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log del error para debugging
  console.error('Error Stack:', err.stack);

  // Error de validación de Mongoose
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(error => error.message).join(', ');
    error = {
      name: 'ValidationError',
      message,
      statusCode: 400
    };
  }

  // Error de duplicado de Mongoose (E11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Recurso duplicado: ${field} ya existe`;
    error = {
      name: 'DuplicateError',
      message,
      statusCode: 409
    };
  }

  // Error de ObjectId inválido de Mongoose
  if (err.name === 'CastError') {
    const message = 'Recurso no encontrado - ID inválido';
    error = {
      name: 'CastError',
      message,
      statusCode: 404
    };
  }

  // Error de conexión a MongoDB
  if (err.name === 'MongoNetworkError') {
    const message = 'Error de conexión a la base de datos';
    error = {
      name: 'DatabaseError',
      message,
      statusCode: 503
    };
  }

  // Error de timeout de MongoDB
  if (err.name === 'MongoServerSelectionError') {
    const message = 'Error de conexión a la base de datos - timeout';
    error = {
      name: 'DatabaseTimeoutError',
      message,
      statusCode: 503
    };
  }

  // Error de JWT (si se implementa autenticación más tarde)
  if (err.name === 'JsonWebTokenError') {
    const message = 'Token de autorización inválido';
    error = {
      name: 'AuthorizationError',
      message,
      statusCode: 401
    };
  }

  // Error de token expirado
  if (err.name === 'TokenExpiredError') {
    const message = 'Token de autorización expirado';
    error = {
      name: 'AuthorizationError',
      message,
      statusCode: 401
    };
  }

  // Respuesta de error
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && {
      error: {
        name: error.name,
        stack: err.stack
      }
    }),
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method
  });
};

module.exports = errorHandler;
