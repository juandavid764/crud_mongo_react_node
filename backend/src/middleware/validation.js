/**
 * Middleware de validación
 * Contiene validadores para diferentes entidades
 */

/**
 * Validador para precio especial
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
const validarPrecioEspecial = (req, res, next) => {
  const {
    usuario,
    producto,
    precioEspecial,
    vigencia
  } = req.body;

  const errores = [];

  // Validar usuario
  if (!usuario) {
    errores.push('Información del usuario es requerida');
  } else {
    if (!usuario.userId || usuario.userId.trim() === '') {
      errores.push('ID del usuario es requerido');
    }
    if (!usuario.nombre || usuario.nombre.trim() === '') {
      errores.push('Nombre del usuario es requerido');
    }
    if (!usuario.email || usuario.email.trim() === '') {
      errores.push('Email del usuario es requerido');
    } else {
      // Validar formato de email
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(usuario.email)) {
        errores.push('Formato de email inválido');
      }
    }
    if (usuario.tipoCliente && !['VIP', 'Premium', 'Corporativo', 'Mayorista', 'Empleado'].includes(usuario.tipoCliente)) {
      errores.push('Tipo de cliente inválido');
    }
  }

  // Validar producto
  if (!producto) {
    errores.push('Información del producto es requerida');
  } else {
    if (!producto.productId) {
      errores.push('ID del producto es requerido');
    }
  }

  // Validar precio especial
  if (precioEspecial === undefined || precioEspecial === null) {
    errores.push('Precio especial es requerido');
  } else {
    if (typeof precioEspecial !== 'number' || precioEspecial <= 0) {
      errores.push('Precio especial debe ser un número mayor a 0');
    }
  }

  // Validar vigencia
  if (!vigencia) {
    errores.push('Información de vigencia es requerida');
  } else {
    if (!vigencia.fechaFin) {
      errores.push('Fecha de fin de vigencia es requerida');
    } else {
      const fechaFin = new Date(vigencia.fechaFin);
      const ahora = new Date();
      if (fechaFin <= ahora) {
        errores.push('Fecha de fin de vigencia debe ser futura');
      }
    }
    
    if (vigencia.fechaInicio) {
      const fechaInicio = new Date(vigencia.fechaInicio);
      const fechaFin = new Date(vigencia.fechaFin);
      if (fechaInicio >= fechaFin) {
        errores.push('Fecha de inicio debe ser anterior a la fecha de fin');
      }
    }
  }

  // Si hay errores, retornar respuesta de error
  if (errores.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors: errores
    });
  }

  // Si no hay errores, continuar
  next();
};

/**
 * Validador para parámetros de consulta
 * @param {Array} camposRequeridos - Array de campos requeridos
 */
const validarQueryParams = (camposRequeridos = []) => {
  return (req, res, next) => {
    const errores = [];

    camposRequeridos.forEach(campo => {
      if (!req.query[campo]) {
        errores.push(`Parámetro ${campo} es requerido`);
      }
    });

    if (errores.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Parámetros de consulta inválidos',
        errors: errores
      });
    }

    next();
  };
};

/**
 * Validador para ID de MongoDB
 * @param {String} paramName - Nombre del parámetro a validar
 */
const validarMongoId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];
    
    // Verificar si es un ObjectId válido de MongoDB (24 caracteres hexadecimales)
    const mongoIdRegex = /^[0-9a-fA-F]{24}$/;
    
    if (!mongoIdRegex.test(id)) {
      return res.status(400).json({
        success: false,
        message: `ID inválido: ${id}`
      });
    }

    next();
  };
};

/**
 * Sanitizador de entrada
 * Limpia y valida datos de entrada básicos
 */
const sanitizeInput = (req, res, next) => {
  // Sanitizar query parameters
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = req.query[key].trim();
      }
    });
  }

  // Sanitizar body parameters
  if (req.body) {
    const sanitizeObject = (obj) => {
      Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'string') {
          obj[key] = obj[key].trim();
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          sanitizeObject(obj[key]);
        }
      });
    };
    
    sanitizeObject(req.body);
  }

  next();
};

module.exports = {
  validarPrecioEspecial,
  validarQueryParams,
  validarMongoId,
  sanitizeInput
};
