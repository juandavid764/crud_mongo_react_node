/**
 * Rutas para productos
 * Define los endpoints relacionados con la gestión de productos
 */

const express = require('express');
const {
  obtenerProductos,
  obtenerProductoPorId,
  obtenerCategorias,
  buscarProductos
} = require('../controllers/productController');

const router = express.Router();

/**
 * @route   GET /api/productos/test
 * @desc    Endpoint de prueba
 * @access  Public
 */
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: '¡Ruta de productos funcionando correctamente!',
    timestamp: new Date().toISOString()
  });
});

/**
 * @route   GET /api/productos
 * @desc    Obtener todos los productos con paginación y filtros
 * @params  page, limit, categoria, buscar, activo, userId
 * @access  Public
 */
router.get('/', obtenerProductos);

/**
 * @route   GET /api/productos/categorias
 * @desc    Obtener todas las categorías disponibles
 * @access  Public
 */
router.get('/categorias', obtenerCategorias);

/**
 * @route   GET /api/productos/buscar
 * @desc    Buscar productos por término
 * @params  termino, userId
 * @access  Public
 */
router.get('/buscar', buscarProductos);

/**
 * @route   GET /api/productos/:id
 * @desc    Obtener un producto específico por ID
 * @params  userId (query parameter opcional)
 * @access  Public
 */
router.get('/:id', obtenerProductoPorId);

module.exports = router;
