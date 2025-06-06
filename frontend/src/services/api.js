import axios from 'axios'

/**
 * Configuración base de la API
 * Define la URL base del backend y configuraciones comunes
 */
const API_BASE_URL = 'http://localhost:5000/api'

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 segundos
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error de API:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

/**
 * Servicios para productos
 */
export const productService = {
  /**
   * Obtener todos los productos con paginación y filtros
   * @param {Object} params - Parámetros de consulta
   * @returns {Promise} Respuesta de la API
   */
  getProducts: async (params = {}) => {
    try {
      const response = await api.get('/productos', { params })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener productos')
    }
  },

  /**
   * Obtener un producto específico por ID
   * @param {string|number} id - ID del producto
   * @param {string} userId - ID del usuario (opcional)
   * @returns {Promise} Respuesta de la API
   */
  getProductById: async (id, userId = null) => {
    try {
      const params = userId ? { userId } : {}
      const response = await api.get(`/productos/${id}`, { params })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener producto')
    }
  },

  /**
   * Obtener categorías disponibles
   * @returns {Promise} Respuesta de la API
   */
  getCategories: async () => {
    try {
      const response = await api.get('/productos/categorias')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener categorías')
    }
  },

  /**
   * Buscar productos por término
   * @param {string} searchTerm - Término de búsqueda
   * @param {string} userId - ID del usuario (opcional)
   * @returns {Promise} Respuesta de la API
   */
  searchProducts: async (searchTerm, userId = null) => {
    try {
      const params = { termino: searchTerm }
      if (userId) params.userId = userId
      const response = await api.get('/productos/buscar', { params })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al buscar productos')
    }
  }
}

/**
 * Servicios para precios especiales
 */
export const specialPriceService = {
  /**
   * Obtener precios especiales con filtros
   * @param {Object} params - Parámetros de consulta
   * @returns {Promise} Respuesta de la API
   */
  getSpecialPrices: async (params = {}) => {
    try {
      const response = await api.get('/precios-especiales', { params })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener precios especiales')
    }
  },

  /**
   * Crear un nuevo precio especial
   * @param {Object} specialPriceData - Datos del precio especial
   * @returns {Promise} Respuesta de la API
   */
  createSpecialPrice: async (specialPriceData) => {
    try {
      const response = await api.post('/precios-especiales', specialPriceData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al crear precio especial')
    }
  },

  /**
   * Actualizar un precio especial
   * @param {string} id - ID del precio especial
   * @param {Object} updateData - Datos actualizados
   * @returns {Promise} Respuesta de la API
   */
  updateSpecialPrice: async (id, updateData) => {
    try {
      const response = await api.put(`/precios-especiales/${id}`, updateData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al actualizar precio especial')
    }
  },

  /**
   * Eliminar un precio especial
   * @param {string} id - ID del precio especial
   * @returns {Promise} Respuesta de la API
   */
  deleteSpecialPrice: async (id) => {
    try {
      const response = await api.delete(`/precios-especiales/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al eliminar precio especial')
    }
  },

  /**
   * Verificar precio especial para usuario y producto
   * @param {string} userId - ID del usuario
   * @param {string|number} productId - ID del producto
   * @returns {Promise} Respuesta de la API
   */
  verifySpecialPrice: async (userId, productId) => {
    try {
      const response = await api.get(`/precios-especiales/verificar/${userId}/${productId}`)
      return response.data
    } catch (error) {
      if (error.response?.status === 404) {
        return null // No hay precio especial
      }
      throw new Error(error.response?.data?.message || 'Error al verificar precio especial')
    }
  },

  /**
   * Obtener precios especiales de un usuario
   * @param {string} userId - ID del usuario
   * @returns {Promise} Respuesta de la API
   */
  getUserSpecialPrices: async (userId) => {
    try {
      const response = await api.get(`/precios-especiales/usuario/${userId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener precios del usuario')
    }
  }
}

/**
 * Servicio de utilidad para verificar el estado de la API
 */
export const healthService = {
  /**
   * Verificar el estado de la API
   * @returns {Promise} Respuesta de la API
   */
  checkHealth: async () => {
    try {
      const response = await api.get('/health')
      return response.data
    } catch (error) {
      throw new Error('API no disponible')
    }
  }
}

export default api
