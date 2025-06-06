/**
 * Controlador de Precios Especiales
 * Maneja las operaciones CRUD para la colección de precios especiales
 */

const SpecialPrice = require('../models/SpecialPrice');
const Product = require('../models/Product');

/**
 * Obtener todos los precios especiales
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const obtenerPreciosEspeciales = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      userId, 
      productId, 
      activo = true,
      vigente = true 
    } = req.query;

    // Construir filtros
    const filtros = {};
    
    if (activo !== undefined) {
      filtros.activo = activo === 'true';
    }
    
    if (userId) {
      filtros['usuario.userId'] = userId;
    }
    
    if (productId) {
      filtros['producto.productId'] = productId;
    }
    
    // Filtrar por vigencia si se solicita
    if (vigente === 'true') {
      const ahora = new Date();
      filtros['vigencia.fechaInicio'] = { $lte: ahora };
      filtros['vigencia.fechaFin'] = { $gte: ahora };
    }

    // Opciones de paginación
    const opciones = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 }
    };

    // Obtener precios especiales
    const preciosEspeciales = await SpecialPrice.find(filtros)
      .limit(opciones.limit * 1)
      .skip((opciones.page - 1) * opciones.limit)
      .sort(opciones.sort);

    // Contar total
    const total = await SpecialPrice.countDocuments(filtros);

    res.status(200).json({
      success: true,
      data: preciosEspeciales,
      pagination: {
        page: opciones.page,
        limit: opciones.limit,
        total,
        pages: Math.ceil(total / opciones.limit)
      },
      message: 'Precios especiales obtenidos exitosamente'
    });

  } catch (error) {
    console.error('Error al obtener precios especiales:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener precios especiales',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Crear un nuevo precio especial
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const crearPrecioEspecial = async (req, res) => {
  try {
    const {
      usuario,
      producto,
      precioEspecial,
      vigencia,
      motivo,
      creadoPor
    } = req.body;

    // Validar datos requeridos
    if (!usuario || !usuario.userId || !usuario.nombre || !usuario.email) {
      return res.status(400).json({
        success: false,
        message: 'Información del usuario incompleta (userId, nombre, email son requeridos)'
      });
    }

    if (!producto || !producto.productId) {
      return res.status(400).json({
        success: false,
        message: 'ID del producto es requerido'
      });
    }

    if (!precioEspecial || precioEspecial <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Precio especial debe ser mayor a 0'
      });
    }

    if (!vigencia || !vigencia.fechaFin) {
      return res.status(400).json({
        success: false,
        message: 'Fecha de fin de vigencia es requerida'
      });
    }

    // Verificar que el producto existe
    const productoExistente = await Product.findOne({
      $or: [
        { _id: producto.productId },
        { productId: producto.productId }
      ]
    });

    if (!productoExistente) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    // Verificar que el precio especial no sea mayor al precio original
    if (precioEspecial > productoExistente.precio) {
      return res.status(400).json({
        success: false,
        message: 'El precio especial no puede ser mayor al precio original del producto'
      });
    }

    // Verificar si ya existe un precio especial activo para este usuario y producto
    const precioExistente = await SpecialPrice.findOne({
      'usuario.userId': usuario.userId,
      'producto.productId': producto.productId,
      activo: true,
      'vigencia.fechaFin': { $gte: new Date() }
    });

    if (precioExistente) {
      return res.status(409).json({
        success: false,
        message: 'Ya existe un precio especial activo para este usuario y producto'
      });
    }

    // Crear nuevo precio especial
    const nuevoPrecioEspecial = new SpecialPrice({
      usuario: {
        userId: usuario.userId,
        nombre: usuario.nombre,
        email: usuario.email,
        tipoCliente: usuario.tipoCliente || 'Premium'
      },
      producto: {
        productId: productoExistente.productId || productoExistente._id,
        nombre: productoExistente.nombre,
        precioOriginal: productoExistente.precio
      },
      precioEspecial,
      vigencia: {
        fechaInicio: vigencia.fechaInicio ? new Date(vigencia.fechaInicio) : new Date(),
        fechaFin: new Date(vigencia.fechaFin)
      },
      motivo: motivo || '',
      creadoPor: creadoPor || 'Sistema'
    });

    const precioGuardado = await nuevoPrecioEspecial.save();

    res.status(201).json({
      success: true,
      data: precioGuardado,
      message: 'Precio especial creado exitosamente'
    });

  } catch (error) {
    console.error('Error al crear precio especial:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Datos de validación incorrectos',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Ya existe un precio especial para este usuario y producto'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al crear precio especial',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Actualizar un precio especial
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const actualizarPrecioEspecial = async (req, res) => {
  try {
    const { id } = req.params;
    const actualizaciones = req.body;

    // Validar que el precio especial existe
    const precioEspecial = await SpecialPrice.findById(id);
    if (!precioEspecial) {
      return res.status(404).json({
        success: false,
        message: 'Precio especial no encontrado'
      });
    }

    // Si se actualiza el precio, validar que no sea mayor al precio original
    if (actualizaciones.precioEspecial) {
      if (actualizaciones.precioEspecial > precioEspecial.producto.precioOriginal) {
        return res.status(400).json({
          success: false,
          message: 'El precio especial no puede ser mayor al precio original del producto'
        });
      }
    }

    // Actualizar el precio especial
    const precioActualizado = await SpecialPrice.findByIdAndUpdate(
      id,
      actualizaciones,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: precioActualizado,
      message: 'Precio especial actualizado exitosamente'
    });

  } catch (error) {
    console.error('Error al actualizar precio especial:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Datos de validación incorrectos',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al actualizar precio especial',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Eliminar un precio especial
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const eliminarPrecioEspecial = async (req, res) => {
  try {
    const { id } = req.params;

    const precioEliminado = await SpecialPrice.findByIdAndDelete(id);

    if (!precioEliminado) {
      return res.status(404).json({
        success: false,
        message: 'Precio especial no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: precioEliminado,
      message: 'Precio especial eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar precio especial:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al eliminar precio especial',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Verificar si un usuario tiene precio especial para un producto
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const verificarPrecioEspecial = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const precioEspecial = await SpecialPrice.encontrarPrecioEspecial(userId, productId);

    if (!precioEspecial) {
      return res.status(404).json({
        success: false,
        message: 'No se encontró precio especial para este usuario y producto'
      });
    }

    res.status(200).json({
      success: true,
      data: precioEspecial,
      message: 'Precio especial encontrado'
    });

  } catch (error) {
    console.error('Error al verificar precio especial:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al verificar precio especial',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Obtener precios especiales de un usuario
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const obtenerPreciosUsuario = async (req, res) => {
  try {
    const { userId } = req.params;

    const preciosEspeciales = await SpecialPrice.obtenerPreciosUsuario(userId);

    res.status(200).json({
      success: true,
      data: preciosEspeciales,
      total: preciosEspeciales.length,
      message: 'Precios especiales del usuario obtenidos exitosamente'
    });

  } catch (error) {
    console.error('Error al obtener precios del usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener precios del usuario',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  obtenerPreciosEspeciales,
  crearPrecioEspecial,
  actualizarPrecioEspecial,
  eliminarPrecioEspecial,
  verificarPrecioEspecial,
  obtenerPreciosUsuario
};
