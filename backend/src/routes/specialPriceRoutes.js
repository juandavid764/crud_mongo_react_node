/**
 * Rutas para precios especiales
 * Define los endpoints relacionados con la gestión de precios especiales
 */

const express = require('express');
const {
  obtenerPreciosEspeciales,
  crearPrecioEspecial,
  actualizarPrecioEspecial,
  eliminarPrecioEspecial,
  verificarPrecioEspecial,
  obtenerPreciosUsuario
} = require('../controllers/specialPriceController');

const router = express.Router();

/**
 * @route   GET /api/precios-especiales
 * @desc    Obtener todos los precios especiales con filtros y paginación
 * @params  page, limit, userId, productId, activo, vigente
 * @access  Public
 */
router.get('/', obtenerPreciosEspeciales);

/**
 * @route   POST /api/precios-especiales
 * @desc    Crear un nuevo precio especial
 * @body    { usuario, producto, precioEspecial, vigencia, motivo, creadoPor }
 * @access  Public
 */
router.post('/', crearPrecioEspecial);

/**
 * @route   GET /api/precios-especiales/verificar/:userId/:productId
 * @desc    Verificar si existe precio especial para usuario y producto específico
 * @access  Public
 */
router.get('/verificar/:userId/:productId', verificarPrecioEspecial);

/**
 * @route   GET /api/precios-especiales/usuario/:userId
 * @desc    Obtener todos los precios especiales de un usuario específico
 * @access  Public
 */
router.get('/usuario/:userId', obtenerPreciosUsuario);

/**
 * @route   PUT /api/precios-especiales/:id
 * @desc    Actualizar un precio especial específico
 * @body    Campos a actualizar
 * @access  Public
 */
router.put('/:id', actualizarPrecioEspecial);

/**
 * @route   DELETE /api/precios-especiales/:id
 * @desc    Eliminar un precio especial específico
 * @access  Public
 */
router.delete('/:id', eliminarPrecioEspecial);

module.exports = router;
