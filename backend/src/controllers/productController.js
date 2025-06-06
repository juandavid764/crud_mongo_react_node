/**
 * Controlador de Productos
 * Maneja las operaciones CRUD para la colección de productos
 */

const Product = require('../models/Product');
const SpecialPrice = require('../models/SpecialPrice');

/**
 * Obtener todos los productos
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const obtenerProductos = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      categoria, 
      buscar, 
      activo = true,
      userId 
    } = req.query;

    // Construir filtros
    const filtros = {};
    
    if (activo !== undefined) {
      filtros.activo = activo === 'true';
    }
    
    if (categoria) {
      filtros.categoria = { $regex: categoria, $options: 'i' };
    }
    
    if (buscar) {
      filtros.$or = [
        { nombre: { $regex: buscar, $options: 'i' } },
        { descripcion: { $regex: buscar, $options: 'i' } }
      ];
    }

    // Opciones de paginación
    const opciones = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { nombre: 1 }
    };

    // Obtener productos
    const productos = await Product.find(filtros)
      .limit(opciones.limit * 1)
      .skip((opciones.page - 1) * opciones.limit)
      .sort(opciones.sort);

    // Contar total de productos
    const total = await Product.countDocuments(filtros);

    // Si se proporciona userId, verificar precios especiales
    let productosConPrecios = productos;
    if (userId) {
      productosConPrecios = await Promise.all(
        productos.map(async (producto) => {
          const precioEspecial = await SpecialPrice.encontrarPrecioEspecial(
            userId, 
            producto.productId
          );
          
          if (precioEspecial) {
            return producto.aplicarPrecioEspecial(precioEspecial.precioEspecial);
          }
          
          return producto.toObject();
        })
      );
    }    res.status(200).json({
      success: true,
      data: productosConPrecios,
      pagination: {
        page: opciones.page,
        limit: opciones.limit,
        total,
        pages: Math.ceil(total / opciones.limit)
      },
      message: total > 0 ? 'Productos obtenidos exitosamente' : 'No se encontraron productos con los filtros especificados',
      debug: {
        filtrosAplicados: filtros,
        baseDatos: 'tienda',
        coleccion: 'products'
      }
    });

  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener productos',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Obtener un producto por ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const obtenerProductoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    // Buscar producto por _id o productId
    let producto = await Product.findOne({
      $or: [
        { _id: id },
        { productId: id }
      ]
    });

    if (!producto) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    // Verificar precio especial si se proporciona userId
    let productoFinal = producto.toObject();
    if (userId) {
      const precioEspecial = await SpecialPrice.encontrarPrecioEspecial(
        userId, 
        producto.productId
      );
      
      if (precioEspecial) {
        productoFinal = producto.aplicarPrecioEspecial(precioEspecial.precioEspecial);
      }
    }

    res.status(200).json({
      success: true,
      data: productoFinal,
      message: 'Producto obtenido exitosamente'
    });

  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener el producto',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Obtener categorías disponibles
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const obtenerCategorias = async (req, res) => {
  try {
    const categorias = await Product.distinct('categoria', { activo: true });
    
    res.status(200).json({
      success: true,
      data: categorias.filter(cat => cat && cat.trim() !== ''),
      message: 'Categorías obtenidas exitosamente'
    });

  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener categorías',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Buscar productos
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const buscarProductos = async (req, res) => {
  try {
    const { termino, userId } = req.query;

    if (!termino || termino.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Se requiere un término de búsqueda'
      });
    }

    // Buscar productos
    const productos = await Product.buscarPorTermino(termino.trim());

    // Aplicar precios especiales si se proporciona userId
    let productosConPrecios = productos;
    if (userId) {
      productosConPrecios = await Promise.all(
        productos.map(async (producto) => {
          const precioEspecial = await SpecialPrice.encontrarPrecioEspecial(
            userId, 
            producto.productId
          );
          
          if (precioEspecial) {
            return producto.aplicarPrecioEspecial(precioEspecial.precioEspecial);
          }
          
          return producto.toObject();
        })
      );
    }

    res.status(200).json({
      success: true,
      data: productosConPrecios,
      total: productosConPrecios.length,
      message: `Se encontraron ${productosConPrecios.length} productos`
    });

  } catch (error) {
    console.error('Error al buscar productos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al buscar productos',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  obtenerProductos,
  obtenerProductoPorId,
  obtenerCategorias,
  buscarProductos
};
