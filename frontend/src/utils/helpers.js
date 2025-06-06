/**
 * Utilidades comunes para la aplicación
 */

/**
 * Formatear precio en pesos colombianos
 * @param {number} price - Precio a formatear
 * @returns {string} Precio formateado
 */
export const formatPrice = (price) => {
  if (typeof price !== 'number') return '$0'
  
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)
}

/**
 * Formatear fecha en formato local colombiano
 * @param {string|Date} date - Fecha a formatear
 * @returns {string} Fecha formateada
 */
export const formatDate = (date) => {
  if (!date) return 'Sin fecha'
  
  const dateObj = new Date(date)
  if (isNaN(dateObj.getTime())) return 'Fecha inválida'
  
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(dateObj)
}

/**
 * Formatear fecha y hora
 * @param {string|Date} date - Fecha a formatear
 * @returns {string} Fecha y hora formateada
 */
export const formatDateTime = (date) => {
  if (!date) return 'Sin fecha'
  
  const dateObj = new Date(date)
  if (isNaN(dateObj.getTime())) return 'Fecha inválida'
  
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj)
}

/**
 * Calcular porcentaje de descuento
 * @param {number} originalPrice - Precio original
 * @param {number} specialPrice - Precio especial
 * @returns {number} Porcentaje de descuento
 */
export const calculateDiscountPercentage = (originalPrice, specialPrice) => {
  if (!originalPrice || !specialPrice || originalPrice <= 0) return 0
  
  const discount = ((originalPrice - specialPrice) / originalPrice) * 100
  return Math.round(discount)
}

/**
 * Validar email
 * @param {string} email - Email a validar
 * @returns {boolean} True si es válido
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Capitalizar primera letra de cada palabra
 * @param {string} str - String a capitalizar
 * @returns {string} String capitalizado
 */
export const capitalizeWords = (str) => {
  if (!str) return ''
  
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Limpiar y validar entrada de texto
 * @param {string} text - Texto a limpiar
 * @returns {string} Texto limpio
 */
export const sanitizeText = (text) => {
  if (!text) return ''
  
  return text.trim().replace(/\s+/g, ' ')
}

/**
 * Generar ID único simple
 * @returns {string} ID único
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

/**
 * Debounce function para búsquedas
 * @param {Function} func - Función a ejecutar
 * @param {number} delay - Delay en milisegundos
 * @returns {Function} Función con debounce
 */
export const debounce = (func, delay) => {
  let timeoutId
  
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(null, args), delay)
  }
}

/**
 * Validar fecha futura
 * @param {string|Date} date - Fecha a validar
 * @returns {boolean} True si es fecha futura
 */
export const isFutureDate = (date) => {
  if (!date) return false
  
  const dateObj = new Date(date)
  const now = new Date()
  
  return dateObj > now
}

/**
 * Obtener fecha en formato ISO para inputs de tipo date
 * @param {Date} date - Fecha
 * @returns {string} Fecha en formato YYYY-MM-DD
 */
export const getDateInputValue = (date = new Date()) => {
  const dateObj = date instanceof Date ? date : new Date(date)
  return dateObj.toISOString().split('T')[0]
}

/**
 * Constantes de tipos de cliente
 */
export const CLIENT_TYPES = {
  VIP: 'VIP',
  PREMIUM: 'Premium',
  CORPORATIVO: 'Corporativo',
  MAYORISTA: 'Mayorista',
  EMPLEADO: 'Empleado'
}

/**
 * Obtener color de badge según tipo de cliente
 * @param {string} clientType - Tipo de cliente
 * @returns {string} Clases CSS para el color
 */
export const getClientTypeColor = (clientType) => {
  const colors = {
    VIP: 'bg-purple-100 text-purple-800 border-purple-300',
    Premium: 'bg-blue-100 text-blue-800 border-blue-300',
    Corporativo: 'bg-green-100 text-green-800 border-green-300',
    Mayorista: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    Empleado: 'bg-gray-100 text-gray-800 border-gray-300'
  }
  
  return colors[clientType] || colors.Premium
}
